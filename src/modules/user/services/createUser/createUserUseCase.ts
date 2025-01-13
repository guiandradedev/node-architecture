import { inject, injectable } from "tsyringe";
import { User, UserToken } from "@/modules/user/domain";
import { IHashAdapter, ISecurityAdapter } from "@/modules/user/adapters";
import { CreateUserRequest, UserAuthenticateResponse } from "@/modules/user/protocols";
import { IUserCodeRepository, IUserRepository, IUserTokenRepository } from "@/modules/user/repositories";
import { ErrAlreadyExists, ErrInvalidParam } from "@/shared/errors";
import { isValidEmail } from "@/shared/utils";
import { CreateSession } from "@/modules/user/utils/Session/SessionService";
import { CreateUserCodeService } from "@/modules/user/utils/UserCode";
import { IMailAdapter } from "@/shared/adapters";
import { IUseCase } from "@/types/services.types";

@injectable()
export class CreateUserUseCase implements IUseCase{
    constructor(
        @inject('UserRepository')
        private readonly userRepository: IUserRepository,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
        @inject('UserCodeRepository')
        private UserCodeRepository: IUserCodeRepository,
        @inject('HashAdapter')
        private readonly hashAdapter: IHashAdapter,
        @inject('MailAdapter')
        private readonly mailAdapter: IMailAdapter,
        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    async execute({ name, email, password, role, createdAt, updatedAt , account_activate_at }: CreateUserRequest): Promise<UserAuthenticateResponse> {
        const userMailExists = await this.userRepository.findByEmail(email)
        if (userMailExists) throw new ErrAlreadyExists('User')

        if(!isValidEmail(email)) throw new ErrInvalidParam('email')

        const passwordHash = await this.hashAdapter.hash(password)
        password = passwordHash;


        const user = User.create({
            name,
            createdAt: createdAt ?? new Date(),
            updatedAt: updatedAt ?? new Date(),
            email,
            password,
            role: role ?? "USER",
            account_activate_at: account_activate_at ?? null
        })

        await this.userRepository.create(user)

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken, refreshTokenExpiresDate } = await sessionService.execute({email, id: user.id })

        const userToken = UserToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            refreshToken,
            userId: user.id
        })
        await this.userTokenRepository.create(userToken)

        const newUserInstance = User.create({ ...user.props }, user.id)

        const userReturn: UserAuthenticateResponse = Object.assign(newUserInstance, {
            token: {
                accessToken,
                refreshToken
            }
        })

        if (!account_activate_at) {
            try {
                const createUserCode = new CreateUserCodeService(this.userRepository, this.UserCodeRepository, this.mailAdapter)
    
                const code = await createUserCode.execute({ user, type: "ACTIVATE_ACCOUNT" })
            } catch (error) {
                console.log(error)                
            }
        }

        return userReturn
    }
}
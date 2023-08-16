import { IHashAdapter } from "@/modules/user/adapters/HashAdapter";
import { ISecurityAdapter } from "@/modules/user/adapters/SecurityAdapter/ISecurityAdapter";
import { AuthToken, User } from "@/modules/user/domain";
import { AuthenticateUserRequest, UserAuthenticateResponse, UserTokenResponse } from "@/modules/user/protocols/authenticateUserDTO";
import { IAuthTokenRepository, IUserRepository } from "@/modules/user/repositories";
import { CreateSession } from "@/modules/user/utils/Session/SessionService";
import { ErrInvalidParam, ErrNotActive } from "@/shared/errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('AuthTokenRepository')
        private authTokenRepository: IAuthTokenRepository,

        @inject('HashAdapter')
        private hashAdapter: IHashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<UserAuthenticateResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new ErrInvalidParam('email or password incorrect')

        const checkPassword = await this.hashAdapter.compare(password, user.props.password);
        if (!checkPassword) throw new ErrInvalidParam('email or password incorrect')

        const newUserInstance = User.create({...user.props}, user.id)

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken, refreshTokenExpiresDate } = await sessionService.execute({email, id: user.id, role: user.props.role})

        const userToken = AuthToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            refreshToken,
            userId: user.id
        })
        await this.authTokenRepository.create(userToken)


        const tokenData: UserTokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        
        const userAuthenticated: UserAuthenticateResponse = Object.assign(newUserInstance, {token: tokenData})

        return userAuthenticated;
    }
}
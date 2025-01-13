import { inject, injectable } from "tsyringe";
import { IHashAdapter } from "@/modules/user/adapters/hash";
import { ISecurityAdapter } from "@/modules/user/adapters/security/ISecurityAdapter";
import { UserToken, User } from "@/modules/user/domain";
import { AuthenticateUserRequest, UserAuthenticateResponse, UserTokenResponse } from "@/modules/user/protocols/authenticateUserDTO";
import { IUserTokenRepository, IUserRepository } from "@/modules/user/repositories";
import { CreateSession } from "@/modules/user/utils/Session/SessionService";
import { ErrInvalidParam, ErrNotActive } from "@/shared/errors";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('UserTokenRepository')
        private UserTokenRepository: IUserTokenRepository,

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

        if(!user.props.account_activate_at) throw new ErrNotActive('user')

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken, refreshTokenExpiresDate } = await sessionService.execute({ email, id: user.id })

        const userToken = UserToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            refreshToken,
            userId: user.id
        })
        await this.UserTokenRepository.create(userToken)

        const tokenData: UserTokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

        const newUserInstance = User.create({...user.props}, user.id)
        const userAuthenticated: UserAuthenticateResponse = Object.assign(newUserInstance, {token: tokenData})

        return userAuthenticated;
    }
}
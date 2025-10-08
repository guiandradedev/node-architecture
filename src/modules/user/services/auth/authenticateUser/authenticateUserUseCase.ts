import { inject, injectable } from "tsyringe";
import { IHashAdapter } from "@/modules/user/adapters/hash";
import { ISecurityAdapter } from "@/modules/user/adapters/security/ISecurityAdapter";
import { User } from "@/modules/user/domain";
import { AuthenticateUserRequest, UserAuthenticateResponse, UserTokenResponse } from "@/modules/user/protocols/services/auth/authenticateUserDTO";
import { IUserRepository } from "@/modules/user/repositories";
import { CreateSession } from "@/modules/user/utils/Session/SessionService";
import { ErrInvalidParam, ErrNotActive } from "@/shared/errors";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('HashAdapter')
        private hashAdapter: IHashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<UserAuthenticateResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new ErrInvalidParam('email or password incorrect')

        if(!user.props.password) throw new ErrInvalidParam("this account was created with a provider")

        const checkPassword = await this.hashAdapter.compare(password, user.props.password);
        if (!checkPassword) throw new ErrInvalidParam('email or password incorrect')

        if(!user.props.account_activate_at) throw new ErrNotActive('user')

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken } = await sessionService.execute({ email, id: user.id })

        const tokenData: UserTokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

        return {
            token: tokenData
        };
    }
}
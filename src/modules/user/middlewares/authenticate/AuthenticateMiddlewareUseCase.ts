import { inject, injectable } from "tsyringe";
import { IUserRepository, IUserTokenRepository } from "@/modules/user/repositories";
import { ISecurityAdapter } from "@/modules/user/adapters";
import { User } from "@/modules/user/domain";
import { ErrUnauthorized } from "@/shared/errors";
import { CreateSessionRequest } from "@/modules/user/utils";
import { AuthenticateMiddlewareRequest, AuthenticateMiddlewareResponse } from "../../protocols/middlewares/AuthenticateMiddlewareDTO";

@injectable()
export class AuthenticateMiddlewareUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    async execute({accessToken}: AuthenticateMiddlewareRequest): Promise<AuthenticateMiddlewareResponse> {
        if (!accessToken) throw new ErrUnauthorized();

        const payload = await this.securityAdapter.decrypt(accessToken, process.env.ACCESS_TOKEN);
        if (!payload || !payload.subject) throw new ErrUnauthorized();

        const isTokenInBlacklist = await this.userTokenRepository.isTokenBlacklisted(accessToken);
        if (isTokenInBlacklist) throw new ErrUnauthorized();

        const user = await this.userRepository.findById(payload.subject);
        if (!user) throw new ErrUnauthorized();

        return { user }
    }
}
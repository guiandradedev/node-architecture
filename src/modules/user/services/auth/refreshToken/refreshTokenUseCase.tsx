import { inject, injectable } from "tsyringe";
import { IUserRepository, IUserTokenRepository } from "@/modules/user/repositories";
import { ErrUnauthorized } from "@/shared/errors";
import { IUseCase } from "@/types/services.types";
import { ISecurityAdapter } from "@/modules/user/adapters";
import { RefreshTokenRequest, RefreshTokenResponse } from "@/modules/user/protocols/services/auth/refreshTokenDTO";
import { CreateSession } from "@/modules/user/utils";
import { UserToken } from "@/modules/user/domain";

@injectable()
export class RefreshTokenUseCase implements IUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('UserTokenRepository')
        private UserTokenRepository: IUserTokenRepository,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    async execute({ refreshToken, audience }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        if (!refreshToken) throw new ErrUnauthorized();

        const payload = await this.securityAdapter.decrypt(refreshToken, process.env.ACCESS_TOKEN);
        if (!payload || !payload.subject) throw new ErrUnauthorized();

        const user = await this.userRepository.findById(payload.subject);
        if (!user) throw new ErrUnauthorized();

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken: refresh, refreshTokenExpiresDate, accessTokenExpiresDate } = await sessionService.execute({ email: user.props.email, id: user.id })

        const userToken = UserToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            refreshToken,
            userId: user.id
        })
        await this.UserTokenRepository.create(userToken)

        return { accessToken, refreshToken: refresh, refreshTokenExpiresDate, accessTokenExpiresDate };

    }
}
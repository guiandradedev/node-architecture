import { inject, injectable } from "tsyringe";
import { IUserRepository, IUserTokenRepository } from "@/modules/user/repositories";
import { ErrInvalidParam, ErrMissingParam, ErrUnauthorized } from "@/shared/errors";
import { IUseCase } from "@/types/services.types";
import { ISecurityAdapter, SecurityDecryptResponse } from "@/modules/user/adapters";
import { RefreshTokenRequest, RefreshTokenResponse } from "@/modules/user/protocols/services/auth/refreshTokenDTO";
import { CreateSession } from "@/modules/user/utils";
import { UserToken } from "@/modules/user/domain";

@injectable()
export class RefreshTokenUseCase implements IUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    async execute({ accessToken, refreshToken, audience }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        if (!refreshToken) throw new ErrUnauthorized();

        const payload = await this.securityAdapter.decrypt(refreshToken, process.env.REFRESH_TOKEN);
        if (!payload || !payload.subject) throw new ErrUnauthorized();

        const user = await this.userRepository.findById(payload.subject);
        if (!user) throw new ErrUnauthorized();

        const isTokenInBlacklist = await this.userTokenRepository.isTokenBlacklisted(refreshToken);
        if (isTokenInBlacklist) throw new ErrUnauthorized();

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken: access, refreshToken: refresh, refreshTokenExpiresDate, accessTokenExpiresDate } = await sessionService.execute({ email: user.props.email, id: user.id })

        const userRefreshToken = UserToken.create({
            token: refreshToken,
            expiresIn: payload.expiresIn,
        })
        await this.userTokenRepository.create(userRefreshToken)


        let access_payload: SecurityDecryptResponse | null = null;
        try {
            access_payload = await this.securityAdapter.decrypt(accessToken, process.env.ACCESS_TOKEN);
        } catch (error) {
            // try catch cala a boca
        }
        if (access_payload) {
            if (access_payload.subject !== user.id) {
                throw new ErrUnauthorized();
            }
            // se conseguir decodificar o access token,
            // significa que ta ativo ainda, coloca na blacklist
            const userAccessToken = UserToken.create({
                token: accessToken,
                expiresIn: access_payload.expiresIn,
            })
            await this.userTokenRepository.create(userAccessToken)
        }


        return { accessToken: access, refreshToken: refresh, refreshTokenExpiresDate, accessTokenExpiresDate };

    }
}
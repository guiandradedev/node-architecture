import { container, inject, injectable } from "tsyringe";
import { ISocialAuthRepository, IUserRepository } from "@/modules/user/repositories";
import { User } from "@/modules/user/domain";
import { SocialAuthRequest, SocialAuthResponse, UserAuthenticateResponse, UserTokenResponse } from "@/modules/user/protocols/services";
import { ISocialAuthProvider } from "../../../utils/SocialAuthProvider/ISocialAuthProvider";
import { SocialAuth } from "../../../domain/social-auth";
import { CreateSession } from "../../../utils";
import { ISecurityAdapter } from "../../../adapters";

@injectable()
export class SocialAuthUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('SocialAuthRepository')
        private socialAuthRepository: ISocialAuthRepository,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    
    async execute(data: SocialAuthRequest): Promise<UserAuthenticateResponse> {
        const authProvider = container.resolve<ISocialAuthProvider>(`${data.provider}AuthProvider`);

        // 1. Validar token com o provedor correspondente
        const userData = await authProvider.validate(data.token);
        if (!userData) throw new Error("Invalid token");

        console.log(userData)

        // 2. Buscar usuário pelo providerId
        let socialAuth = await this.socialAuthRepository.findByProvider(data.provider, userData.id);

        if (!socialAuth) {
            // 3. Criar novo usuário se não existir
            const user = User.create({ email: userData.email, name: userData.name, role: "USER", account_activate_at: new Date(), createdAt: new Date(), updatedAt: new Date() });

            await this.userRepository.create(user);

            // 4. Criar entrada no SocialAuth
            socialAuth = SocialAuth.create({
                provider: data.provider,
                providerId: userData.id,
                userId: user.id,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await this.socialAuthRepository.create(socialAuth);
        }

        const user = await this.userRepository.findById(socialAuth.props.userId)

        // 5. Retornar token JWT do usuário
        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken } = await sessionService.execute({ email: user.props.email, id: user.id })

        const tokenData: UserTokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

        return {
            token: tokenData
        };
    }
}
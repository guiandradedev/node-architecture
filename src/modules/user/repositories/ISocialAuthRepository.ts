import { SocialAuth, SocialAuthProvider } from "@/modules/user/domain/social-auth"

export interface ISocialAuthRepository {
    create(data: SocialAuth): Promise<void>;
    findByProvider(provider: SocialAuthProvider, id: string): Promise<SocialAuth>;
}
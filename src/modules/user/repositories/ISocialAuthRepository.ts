import { SocialAuth, SocialAuthProvider } from "../domain/social-auth"

export interface ISocialAuthRepository {
    create(data: SocialAuth): Promise<void>;
    findByProvider(provider: SocialAuthProvider, id: string): Promise<SocialAuth>;
}
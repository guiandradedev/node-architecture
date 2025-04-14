import { Entity } from "@/shared/core/entity";

export type SocialAuthProvider = "Google"

type SocialAuthProps = {
    provider: SocialAuthProvider,
    providerId: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date
}

export class SocialAuth extends Entity<SocialAuthProps> {
    private constructor(props: SocialAuthProps, id?: string) {
        super(props, id)
    }

    public static create(props: SocialAuthProps, id?: string) {
        const socialAuth = new SocialAuth(props, id);

        return socialAuth;
    }
}
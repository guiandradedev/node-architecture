import { Entity } from "@/shared/core/entity";

type AuthTokenProps = {
    refreshToken: string,
    refreshTokenExpiresDate: Date,
    createdAt: Date,
    userId: string
}

export class AuthToken extends Entity<AuthTokenProps> {
    private constructor(props: AuthTokenProps, id?: string) {
        super(props, id)
    }

    public static create(props: AuthTokenProps, id?: string) {
        const token = new AuthToken(props, id);

        return token;
    }
}
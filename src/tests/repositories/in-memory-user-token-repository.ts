import { UserToken } from "@/modules/user/domain";
import { IUserTokenRepository } from "@/modules/user/repositories";

export class InMemoryUserTokenRepository implements IUserTokenRepository {
    public tokens: UserToken[] = []

    async create(data: UserToken): Promise<void> {
        this.tokens.push(data)
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        return this.tokens.some(t => t.props.token === token);
    }

}
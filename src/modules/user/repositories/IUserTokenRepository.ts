import { UserToken } from "@/modules/user/domain";

export interface IUserTokenRepository {
    isTokenBlacklisted(token: string): Promise<boolean>;
    create(data: UserToken): Promise<void>;
}
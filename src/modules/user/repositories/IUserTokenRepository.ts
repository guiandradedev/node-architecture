import { UserToken, UserTokenTypes } from "@/modules/user/domain";

export interface IUserTokenRepository {
    create(data: UserToken): Promise<void>;
    findByToken(type: UserTokenTypes, token: string): Promise<UserToken>;
}
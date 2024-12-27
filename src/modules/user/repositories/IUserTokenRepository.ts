import { UserToken } from "@/modules/user/domain";

export interface IUserTokenRepository {
    create(data: UserToken): Promise<void>;
    findByToken(refreshToken: string): Promise<UserToken>;
}
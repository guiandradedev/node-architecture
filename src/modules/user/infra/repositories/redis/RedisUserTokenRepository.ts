import { getRedisClient } from "@/infra/providers/database/redis";
import { UserToken } from "@/modules/user/domain";
import { IUserTokenRepository } from "@/modules/user/repositories";

export class RedisUserTokenRepository implements IUserTokenRepository {
    private redis = getRedisClient();
    
    async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const redis = this.redis;
            const isBlacklisted = await redis.sIsMember("blacklist", token);
            return isBlacklisted === 1;
        } catch (error) {
            console.error('Erro ao verificar se o token está na blacklist:', error);
            throw new Error('Erro ao verificar blacklist no Redis');
        }
    }

    // Adiciona o token à blacklist
    async create(data: UserToken): Promise<void> {
        try {
            const redis = this.redis;
            const expirationTime = data.props.expiresIn.getTime() - Date.now();
            await redis.sAdd("blacklist", data.props.token);
            await redis.expire("blacklist", expirationTime / 1000);
        } catch (error) {
            console.error('Erro ao adicionar token à blacklist:', error);
            throw new Error('Erro ao adicionar token à blacklist no Redis');
        }
    }
}

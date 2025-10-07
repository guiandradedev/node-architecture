import { getRedisClient } from "@/infra/providers/database/redis";
import { UserToken } from "@/modules/user/domain";
import { IUserTokenRepository } from "@/modules/user/repositories";

export class RedisUserTokenRepository implements IUserTokenRepository {
    private redis = getRedisClient();

    async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const redis = this.redis;
            // Checar se o token está na blacklist, que agora é uma chave individual no Redis
            const isBlacklisted = await redis.exists(`blacklist:${token}`);
            return isBlacklisted === 1; // Se o token existir, está na blacklist
        } catch (error) {
            console.error('Erro ao verificar se o token está na blacklist:', error);
            throw new Error('Erro ao verificar blacklist no Redis');
        }
    }

    // Adiciona o token à blacklist com TTL individual
    async create(data: UserToken): Promise<void> {
        try {
            const redis = this.redis;
            const token = data.props.token;
            
            // Armazenar o token individualmente
            await redis.set(`blacklist:${token}`, token);

            const expirationTimeMs = data.props.expiresIn.getTime() - Date.now();
            const ttlSeconds = Math.max(0, Math.floor(expirationTimeMs / 1000));

            // Definir o TTL para o token individualmente
            if (ttlSeconds > 0) {
                await redis.expire(`blacklist:${token}`, ttlSeconds);
            }
        } catch (error) {
            console.error('Erro ao adicionar token à blacklist:', error);
            throw new Error('Erro ao adicionar token à blacklist no Redis');
        }
    }
}

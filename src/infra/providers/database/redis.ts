// redis.ts
import { createClient, RedisClientType } from 'redis';

let redis_client: RedisClientType | null = null;

export function getRedisClient() {
    if (!redis_client) {
        redis_client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'redis',
                port: Number(process.env.REDIS_PORT) || 6379,
            }
        });

        redis_client.on('error', (err) => {
            console.error('Redis error:', err);
        });

        redis_client.connect().catch((err) => {
            console.error('Redis connection failed:', err);
        });
    }

    return redis_client;
}

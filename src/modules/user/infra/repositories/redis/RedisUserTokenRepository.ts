import { prismaClient } from "@/infra/providers/database/prisma";
import { UserToken } from "@/modules/user/domain";
import { prismaUserTokenToEntity } from "@/modules/user/mappers/prisma";
import { IUserTokenRepository } from "@/modules/user/repositories";


export class RedisUserTokenRepository implements IUserTokenRepository {
    async findByToken(refreshToken: string): Promise<UserToken> {
        // const token = await prismaClient.userToken.findFirst({
        //     where: {
        //         refreshToken
        //     }
        // })
        // if(!token) return null;
        // return prismaUserTokenToEntity(token);
        throw new Error()
    }
    async create(data: UserToken): Promise<void> {
        throw new Error()
    }
}
import { prismaClient } from "@/infra/providers/database/prisma";
import { UserToken } from "@/modules/user/domain";
import { prismaUserTokenToEntity } from "@/modules/user/mappers/prisma";
import { IUserTokenRepository } from "@/modules/user/repositories";


export class PrismaUserTokenRepository implements IUserTokenRepository {
    async findByToken(refreshToken: string): Promise<UserToken> {
        const token = await prismaClient.userToken.findFirst({
            where: {
                refreshToken
            }
        })
        if(!token) return null;
        return prismaUserTokenToEntity(token);
    }
    async create(data: UserToken): Promise<void> {
        await prismaClient.userToken.create({ data: { ...data.props, id: data.id } })
    }
}
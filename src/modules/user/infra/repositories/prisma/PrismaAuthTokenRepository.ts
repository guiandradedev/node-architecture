import { prismaClient } from "@/infra/providers/database/prisma";
import { AuthToken } from "@/modules/user/domain";
import { IAuthTokenRepository } from "@/modules/user/repositories";


export class PrismaAuthTokenRepository implements IAuthTokenRepository {
    async create(data: AuthToken): Promise<void> {
        await prismaClient.authToken.create({ data: { ...data.props, id: data.id } })
    }
}
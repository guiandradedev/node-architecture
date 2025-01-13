import { IUserRepository } from "@/modules/user/repositories";
import { prismaUserToEntity } from "@/modules/user/mappers/prisma";
import { prismaClient } from "@/infra/providers/database/prisma";
import { User } from "@/modules/user/domain";

export class PrismaUserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User> {
        const user = await prismaClient.user.findUnique({ where: { email } })

        if (!user) return null;

        return prismaUserToEntity(user);
    }

    async create(data: User): Promise<void> {
        const { ...rest } = data.props

        await prismaClient.user.create({ data: { ...rest, id: data.id } })
    }

    async findById(id: string): Promise<User | null> {
        const user = await prismaClient.user.findUnique({ where: { id } })

        if (!user) return null;

        return prismaUserToEntity(user);
    }

    async changeStatus(id: string): Promise<boolean> {
        const user = await this.findById(id)
        if(!user) return null;

        let status = null;
        if(!user.props.account_activate_at) {
            status = new Date();
        }

        await prismaClient.user.update({
            where: {id},
            data: {
                account_activate_at: status
            }
        })

        return !!status
    }
    async changePassword({userId, password}: {userId: string, password: string}): Promise<User> {
        const user = await prismaClient.user.findUnique({ where: { id: userId } });

        if (!user) {
            return null;
        }
    
        const updatedUser = await prismaClient.user.update({
            where: { id: userId },
            data: { password },
        });
    
        return prismaUserToEntity(updatedUser);
    }

}
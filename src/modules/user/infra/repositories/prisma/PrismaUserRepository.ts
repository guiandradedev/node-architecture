import { IUserRepository } from "@/modules/user/repositories";
import { prismaUserToEntity } from "@/modules/user/mappers/prisma";
import { prismaClient } from "@/infra/providers/database/prisma";
import { Address, Phone, User } from "@/modules/user/domain";
import { Address as PrismaAddress } from '@prisma/client'

export class PrismaUserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User> {
        const user = await prismaClient.user.findUnique({ where: { email } })

        if (!user) return null;

        return prismaUserToEntity(user);
    }

    async findByCpf(cpf: string): Promise<User> {
        const user = await prismaClient.user.findUnique({ where: { cpf } })

        if (!user) return null;

        return prismaUserToEntity(user);
    }

    async create(data: User): Promise<void> {
        const { address, phone, ...rest } = data.props

        await prismaClient.user.create({ data: { ...rest, id: data.id } })
        if(address) await this.createAddress(address)
        if(phone) await this.createPhone(phone)
    }

    async createAddress(data: Address | Address[]): Promise<void> {
        if (Array.isArray(data)) {
            for (const address of data) {
                await prismaClient.address.create({ data: { ...address.props, id: address.id } })
            }
        } else {
            await prismaClient.address.create({ data: { ...data.props, id: data.id } })
        }
    }

    async createPhone(data: Phone | Phone[]): Promise<void> {
        if (Array.isArray(data)) {
            for (const phone of data) {
                await prismaClient.phone.create({ data: { ...phone.props, id: phone.id } })
            }
        } else {
            await prismaClient.phone.create({ data: { ...data.props, id: data.id } })
        }
    }

    async findById(id: string): Promise<User | null> {
        const user = await prismaClient.user.findUnique({ where: { id } })

        if (!user) return null;

        return prismaUserToEntity(user);
    }

    async changeStatus(id: string): Promise<boolean> {
        const user = await this.findById(id)
        if(!user) return null;

        const status = !user.props.active

        await prismaClient.user.update({
            where: {id},
            data: {
                active: status
            }
        })

        return status
    }

}
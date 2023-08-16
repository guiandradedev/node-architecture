import { TypeUserRoles, User } from "@/modules/user/domain"
import { User as prismaUser } from "@prisma/client"

const prismaUserToEntity = (u: prismaUser): User => {
    const user = User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        createdAt: u.createdAt,
        role: u.role as TypeUserRoles
    }, u.id)

    return user
}

export { prismaUserToEntity }
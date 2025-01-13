import { TypesUserCode, TypeUserRoles, User, UserCode, UserToken} from "@/modules/user/domain"
import { User as prismaUser, UserCode as prismaUserCode, UserToken as prismaUserToken} from "@prisma/client"

const prismaUserToEntity = (u: prismaUser): User => {
    const user = User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        createdAt: u.createdAt,
        role: u.role as TypeUserRoles,
        account_activate_at: u.account_activate_at,
        updatedAt: u.updatedAt
    }, u.id)

    return user
}

const prismaUserCodeToEntity = (u: prismaUserCode): UserCode => {
    const user = UserCode.create({
        code: u.code,
        createdAt: u.createdAt,
        expiresIn: u.expiresIn,
        active: u.active,
        type: u.type as TypesUserCode,
        userId: u.userId,
    }, u.id)

    return user
}
const prismaUserTokenToEntity = (u: prismaUserToken): UserToken => {
    const user = UserToken.create({
        refreshToken: u.refreshToken,
        refreshTokenExpiresDate: u.refreshTokenExpiresDate,
        createdAt: u.createdAt,
        userId: u.userId,
    }, u.id)

    return user
}

export { prismaUserToEntity, prismaUserCodeToEntity, prismaUserTokenToEntity }
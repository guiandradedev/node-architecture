import { TypesUserCode, TypeUserRoles, User } from "@/modules/user/domain"

export type GenerateUserDTO = {
    user: User,
    type: TypesUserCode
}
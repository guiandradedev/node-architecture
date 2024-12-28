import { TypesUserCode, TypeUserRoles, User } from "../domain"

export type GenerateUserDTO = {
    user: User,
    type: TypesUserCode
}
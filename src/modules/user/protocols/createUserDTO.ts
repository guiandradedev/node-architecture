import { TypeUserRoles } from "../domain"

export type CreateUserRequest = {
    name: string,
    email: string,
    password: string,
    role?: TypeUserRoles,
    createdAt?: Date,
    updatedAt?: Date,
    active?: boolean
}
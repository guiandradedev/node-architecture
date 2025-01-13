import { UseCaseRequest } from "@/types/services.types"
import { TypeUserRoles } from "../domain"

export interface CreateUserRequest extends UseCaseRequest {
    name: string,
    email: string,
    password: string,
    role?: TypeUserRoles,
    createdAt?: Date,
    updatedAt?: Date,
    account_activate_at?: Date
}
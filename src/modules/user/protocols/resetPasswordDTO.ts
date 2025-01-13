import { UseCaseRequest, UseCaseResponse } from "@/types/services.types"
import { User } from "../domain"

export interface ResetPasswordRequest extends UseCaseRequest {
    code: string,
    password: string,
    confirmPassword: string,
    email: string
}
export interface ResetPasswordResponse extends User, UseCaseResponse{}

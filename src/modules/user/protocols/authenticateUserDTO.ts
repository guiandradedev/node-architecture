import { UseCaseRequest, UseCaseResponse } from "@/types/services.types"
import { User } from "../domain"


export interface AuthenticateUserRequest extends UseCaseRequest {
    email: string,
    password: string
}

export interface UserTokenResponse extends UseCaseResponse{
    accessToken: string,
    refreshToken: string
}

export interface UserAuthenticateResponse extends User {
    token: UserTokenResponse
}
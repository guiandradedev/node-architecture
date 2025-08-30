import { UseCaseRequest, UseCaseResponse } from "@/types/services.types"
import { User } from "../domain"
import z from "zod"


export interface AuthenticateUserRequest extends UseCaseRequest {
    email: string,
    password: string
}

export interface UserTokenResponse extends UseCaseResponse {
    accessToken: string,
    refreshToken: string
}

export interface UserAuthenticateResponse extends User {
    token: UserTokenResponse
}

export const successAuthenticateUserResponse = z.object({
    data: z.object({
        id: z.number(),
        attributes: z.object({
            name: z.string(),
            email: z.string().email(),
            role: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
            account_activate_at: z.string().nullable(),
        }),
        links: z.object({
            self: z.string(),
        }),
        token: z.object({
            access_token: z.string(),
            refresh_token: z.string(),
        }),
    }),
});
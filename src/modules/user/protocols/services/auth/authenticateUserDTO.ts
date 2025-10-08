import { UseCaseRequest, UseCaseResponse } from "@/types/services.types"
import { User } from "@/modules/user/domain"
import z from "zod"


export interface AuthenticateUserRequest extends UseCaseRequest {
    email: string,
    password: string
}

export interface UserTokenResponse extends UseCaseResponse {
    accessToken: string,
    refreshToken: string
}

export interface UserAuthenticateResponse {
    token: UserTokenResponse
}

export const successAuthenticateUserResponse = z.object({
  data: z.object({
    token: z.object({
      access_token: z.string(),
      refresh_token: z.string(),
    }),
  }),
});
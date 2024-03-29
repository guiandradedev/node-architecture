import { User } from "../domain"

export type AuthenticateUserRequest = {
    email: string,
    password: string
}

export interface UserTokenResponse {
    accessToken: string,
    refreshToken: string
}

export interface UserAuthenticateResponse extends User {
    token: UserTokenResponse
}
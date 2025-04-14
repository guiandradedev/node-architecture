import { UseCaseRequest, UseCaseResponse } from "@/types/services.types"
import { User } from "../domain"
import { SocialAuthProvider } from "../domain/social-auth"
import { UserTokenResponse } from "./authenticateUserDTO"

export interface SocialAuthRequest extends UseCaseRequest {
    token: string,
    provider: SocialAuthProvider
}
export interface SocialAuthResponse extends User, UseCaseResponse{
    token: UserTokenResponse
}

import { UseCaseRequest, UseCaseResponse } from "@/types/services.types";
import { UserCode } from "@/modules/user/domain";
import { ITokens } from "@/types/token.types";

export interface RefreshTokenRequest extends UseCaseRequest{
    accessToken: string,
    refreshToken: string,
    audience: string // user IP
}
export interface RefreshTokenResponse extends UseCaseResponse, ITokens{}

import { UseCaseRequest, UseCaseResponse } from "@/types/services.types";
import { User } from "@/modules/user/domain";

export interface AuthenticateMiddlewareRequest extends UseCaseRequest{
    accessToken: string,
}
export interface AuthenticateMiddlewareResponse extends UseCaseResponse{
    user: User
}

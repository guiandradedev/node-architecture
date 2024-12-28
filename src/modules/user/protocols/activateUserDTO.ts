import { UseCaseRequest, UseCaseResponse } from "@/types/services.types";
import { UserCode } from "../domain";

export interface ActivateUserRequest extends UseCaseRequest{
    code: string,
    userId: string
}
export interface ActivateUserResponse extends UserCode, UseCaseResponse{}

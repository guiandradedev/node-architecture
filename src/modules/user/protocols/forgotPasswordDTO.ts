import { UseCaseRequest, UseCaseResponse } from "@/types/services.types";
import { UserCode } from "../domain";

export interface ForgotPasswordRequest extends UseCaseRequest{
    email: string
}
export interface ForgotPasswordResponse extends UserCode, UseCaseResponse{}

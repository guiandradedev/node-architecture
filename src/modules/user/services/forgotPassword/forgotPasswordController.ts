import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ForgotPasswordUseCase } from "./forgotPasswordUseCase";
import { ForgotPasswordRequest } from "@/modules/user/protocols";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { IController } from "@/types/services.types";
import z from "zod";

export class ForgotPasswordController implements IController{

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const {email} = request.body as ForgotPasswordRequest

        try {
            await validateInput({ email }, ['email']);
            
            const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase)

            await forgotPasswordUseCase.execute({
                email
            })

            return reply.status(200).send({data: 'Code sent in your email'});
        } catch (error) {
            if(error instanceof AppError) {
                return reply.status(error.status).send({ errors: [error] })
            }
            return reply.status(500).send({ errors: [new ErrServerError()] })
        }
    }

    public getProperties(): RouteShorthandOptions {
        return {
            schema: this.getSchema(),
        };
    }

    private getSchema(): FastifySchema {
        const resetPasswordBody = z.object({
            email: z.string().email(),
        });
    
        return {
            description: "Change password",
            tags: ["Auth"],
            summary: "Change password",
            body: resetPasswordBody,
            response: {
                200: z.object({
                    data: z.string().describe("Success message"),
                }).describe("Success response"),
                // 422: z.object({
                //     errors: z.array(z.object({
                //         message: z.string(),
                //         field: z.string().optional(),
                //     })).describe("Validation error"),
                // }).describe("Validation error"),
            },
        };
    }
};
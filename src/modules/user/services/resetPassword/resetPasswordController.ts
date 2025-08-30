import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";
import { ResetPasswordRequest } from "@/modules/user//protocols";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { IController } from "@/types/services.types";
import z from "zod";

export class ResetPasswordController implements IController{

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const {code, confirmPassword, password, email} = request.body as ResetPasswordRequest

        
        try {
            await validateInput({ code, confirmPassword, password, email }, ['code', 'password', 'confirmPassword', 'email']);
            
            if (password !== confirmPassword) return reply.status(422).send({ errors: [new ErrInvalidParam('password and confirmPassword')] })
                
            const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

            await resetPasswordUseCase.execute({
                code,
                password,
                confirmPassword,
                email
            })

            return reply.status(200).send({data: 'Password successful changed!'});
        } catch (error) {
            if(error instanceof AppError) {
                return reply.status(error.status).send({ errors: [error] })
            }
            console.log(error)
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
            password: z.string().min(6),
            confirmPassword: z.string().min(6),
            code: z.string(),
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
            },
        };
    }
};
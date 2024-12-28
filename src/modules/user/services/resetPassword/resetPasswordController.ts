import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ResetPasswordUseCase } from "./resetPasswordUseCase";
import { ResetPasswordRequest } from "@/modules/user//protocols";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";

export class ResetPasswordController {

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const {code, confirmPassword, password} = request.body as ResetPasswordRequest

        await validateInput({ code, confirmPassword, password }, ['code', 'password', 'confirmPassword']);
        
        if (password !== confirmPassword) return reply.status    (422).send({ errors: [new ErrInvalidParam('password and confirmPassword')] })

        try {
            const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

            await resetPasswordUseCase.execute({
                code,
                password,
                confirmPassword
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
};
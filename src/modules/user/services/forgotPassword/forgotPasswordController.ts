import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ForgotPasswordUseCase } from "./forgotPasswordUseCase";
import { ForgotPasswordRequest } from "@/modules/user/protocols";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";

export class ForgotPasswordController {

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
};
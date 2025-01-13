import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ActivateUserUseCase } from "./activateUserUseCase";
import { ActivateUserRequest } from "@/modules/user/protocols";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";

export class ActivateUserController {

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const {code, userId} = request.body as ActivateUserRequest

        try {
            await validateInput({ code, userId }, ['code', 'userId']);

            const activateUserUseCase = container.resolve(ActivateUserUseCase)

            await activateUserUseCase.execute({
                code,
                userId
            })

            return reply.status(200).send({data: 'Account activated!'});
        } catch (error) {
            if(error instanceof AppError) {
                return reply.status(error.status).send({ errors: [error] })
            }
            return reply.status(500).send({ errors: [new ErrServerError()] })
        }
    }
};
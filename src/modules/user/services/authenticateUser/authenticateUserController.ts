import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { AuthenticateUserRequest } from "@/modules/user/protocols/authenticateUserDTO";
import { userTokenResponse } from "@/shared/helpers/response";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";

export class AuthenticateUserController {

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { email, password } = request.body as AuthenticateUserRequest

        try {
            await validateInput({ email, password }, ['email', 'password']);

            const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

            const user = await authenticateUserUseCase.execute({
                email,
                password
            })

            return reply.status(200).send({data: userTokenResponse(user)});
        } catch (error) {
            if(error instanceof AppError) {
                return reply.status(error.status).send({ errors: [error] })
            }
            return reply.status(500).send({ errors: [new ErrServerError()] })
        }
    }
};
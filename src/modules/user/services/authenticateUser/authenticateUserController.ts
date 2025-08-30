import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { AuthenticateUserRequest, successAuthenticateUserResponse } from "@/modules/user/protocols/authenticateUserDTO";
import { userTokenResponse } from "@/shared/helpers/response";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import z from "zod";

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


    public getProperties(): RouteShorthandOptions {
        return {
            schema: this.getSchema(),
        };
    }

    private getSchema(): FastifySchema {
        const authenticateUserBody = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });
    
        return {
            description: "Authenticate a user",
            tags: ["Auth"],
            summary: "Authenticates a user and returns a token",
            body: authenticateUserBody,
            response: {
                200: successAuthenticateUserResponse,
            },
        };
    }
};
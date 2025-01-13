import { container } from "tsyringe";

import { CreateUserUseCase } from "./createUserUseCase";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { userResponse } from "@/shared/helpers/response";
import { IController } from "@/types/services.types"
import { CreateUserRequest } from "@/modules/user/protocols";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";

export class CreateUserController implements IController{

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { name, email, password } = request.body as CreateUserRequest

        try {
            await validateInput({ name, email, password }, ['name', 'email', 'password']);

            const createUserUseCase = container.resolve(CreateUserUseCase)

            const user = await createUserUseCase.execute({
                name,
                email,
                password
            })

            return reply.status(201).send({data: userResponse(user)});
        } catch (error) {
            console.log(error)
            if(error instanceof AppError) {
                return reply.status(error.status).send({ errors: [error] })
            }
            return reply.status(500).send({erros: [new ErrServerError()]})
        }
    }

    // getSchema(): RouteShorthandOptions {
    //     return {
    //         description: 'Fetch user information',
    //         tags: ['User'],
    //         summary: 'Get user data',
    //         response: {
    //             200: {
    //                 type: 'object',
    //                 properties: {
    //                     status: { type: 'string' },
    //                     message: { type: 'string' },
    //                     data: {
    //                         type: 'object',
    //                         properties: {
    //                             id: { type: 'number' },
    //                             name: { type: 'string' },
    //                             email: { type: 'string' },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     };
    // }
};
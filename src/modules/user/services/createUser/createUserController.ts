import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./createUserUseCase";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { userResponse } from "@/shared/helpers/response";
import { CreateUserRequest } from "@/modules/user/protocols";

export class CreateUserController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email, password }: CreateUserRequest = request.body

        if (!name || !email || !password) return response.status(422).json({erros: [new ErrInvalidParam('data')]})

        try {
            const createUserUseCase = container.resolve(CreateUserUseCase)

            const user = await createUserUseCase.execute({
                name,
                email,
                password
            })

            return response.status(201).json({data: userResponse(user)});
        } catch (error) {
            console.log(error)
            if(error instanceof AppError) {
                return response.status(error.status).json({ errors: [error] })
            }
            return response.status(500).json({erros: [new ErrServerError()]})
        }
    }
};
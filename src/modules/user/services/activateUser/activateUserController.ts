import { container } from "tsyringe";
import { AppError, ErrServerError } from "@/shared/errors";
import { ActivateUserUseCase } from "./activateUserUseCase";
import { ActivateUserRequest } from "@/modules/user/protocols";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { IController } from "@/types/services.types";
import z from "zod";

export class ActivateUserController implements IController {

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { code, userId } = request.body as ActivateUserRequest

        try {
            await validateInput({ code, userId }, ['code', 'userId']);

            const activateUserUseCase = container.resolve(ActivateUserUseCase)

            await activateUserUseCase.execute({
                code,
                userId
            })

            return reply.status(200).send({ data: 'Account activated!' });
        } catch (error) {
            if (error instanceof AppError) {
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
        const activateUserBody = z.object({
            code: z.string(),
            userId: z.string().uuid(),
        });

        return {
            description: "Change password",
            tags: ["Auth"],
            summary: "Change password",
            body: activateUserBody,
            response: {
                200: z.object({
                    data: z.string().describe("Success message"),
                }).describe("Success response"),
            },
        };
    }
};
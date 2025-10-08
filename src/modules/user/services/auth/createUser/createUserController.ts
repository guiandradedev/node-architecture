import { container } from "tsyringe";
import { CreateUserUseCase } from "./createUserUseCase";
import { AppError, ErrServerError } from "@/shared/errors";
import { userResponse } from "@/shared/helpers/response";
import { IController } from "@/types/services.types";
import { CreateUserRequest } from "@/modules/user/protocols/services";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import z from "zod";

export class CreateUserController implements IController {

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { name, email, password } = request.body as CreateUserRequest;

        try {
            await validateInput({ name, email, password }, ['name', 'email', 'password']);

            const createUserUseCase = container.resolve(CreateUserUseCase);
            const tokens = await createUserUseCase.execute({ name, email, password });

            return reply.status(201).send({ data: tokens });
        } catch (error) {
            console.error(error);
            if (error instanceof AppError) {
                return reply.status(error.status).send({ errors: [error] });
            }
            return reply.status(500).send({ errors: [new ErrServerError()] });
        }
    }

    public getProperties(): RouteShorthandOptions {
        return {
            schema: this.getSchema(),
        };
    }

    private getSchema(): FastifySchema {
        const createUserBody = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        });
        
        const createUserResponse = z.object({
            data: z.object({
            id: z.number(),
            attributes: z.object({
                name: z.string(),
                email: z.string().email(),
                role: z.string(),
                createdAt: z.string(),
                updatedAt: z.string(),
                account_activate_at: z.string().nullable(),
            }),
            links: z.object({
                self: z.string()
            })
            })
        });
        return {
            description: 'Create a new user',
            tags: ['Auth'],
            summary: 'Creates a new user and returns user data',
            body: createUserBody,
            response: {
                // 201: createUserResponse
            }

        }
    }
}
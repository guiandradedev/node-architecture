import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError, ErrUnauthorized } from "@/shared/errors";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { userResponse, userTokenResponse } from "@/shared/helpers";
import { IController } from "@/types/services.types";
import z from "zod";

export class MeController implements IController {

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        try {
            const user = request.user; // pegando o user que o middleware colocou
            if (!user) return reply.status(401).send({ errors: [new ErrUnauthorized()] });

            return reply.status(200).send({ data: userResponse(user) });
        } catch (error) {
            if (error instanceof AppError) {
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
        const headersSchema = z.object({
            authorization: z.string().describe('Authorization header in the form "Bearer <accessToken>"'),
        });

        return {
            description: "Return authenticated user",
            tags: ["User"],
            summary: "Get current user (accessToken from Authorization header, refreshToken in body)",
            headers: headersSchema,
            response: {
            },
        };
    }
};
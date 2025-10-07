import { container } from "tsyringe";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { IController } from "@/types/services.types";
import z from "zod";
import { RefreshTokenRequest } from "@/modules/user/protocols/services/auth/refreshTokenDTO";
import { AppError, ErrServerError } from "@/shared/errors";
import { RefreshTokenUseCase } from "./refreshTokenUseCase";

export class RefreshTokenController implements IController{

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { refreshToken } = request.body as RefreshTokenRequest

        try {
            await validateInput({ refreshToken }, ['refreshToken']);

            const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)

            const audience = request.ip || 'unknown'

            const { accessToken, refreshToken: refresh } = await refreshTokenUseCase.execute({
                refreshToken,
                audience
            })

            return reply.status(200).send({data: { accessToken, refreshToken: refresh } });
        } catch (error) {
            if(error instanceof AppError) {
                return reply.status(error.status).send({ errors: [error] })
            }
            return reply.status(500).send({ errors: [new ErrServerError()] })
        }    }

    public getProperties(): RouteShorthandOptions {
        return {
            schema: this.getSchema(),
        };
    }

    private getSchema(): FastifySchema {
        const resetPasswordBody = z.object({
        });
    
        return {
            description: "Refresh Token",
            tags: ["Auth"],
            summary: "Refresh Token",
            body: resetPasswordBody,
            response: {
              200: z.object({
                    data: z.string().describe("Success message"),
                }).describe("Success response"),
            },
        };
    }
};
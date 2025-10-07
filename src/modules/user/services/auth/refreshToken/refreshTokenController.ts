import { container } from "tsyringe";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { IController } from "@/types/services.types";
import z from "zod";
import { RefreshTokenRequest } from "@/modules/user/protocols/services/auth/refreshTokenDTO";
import { AppError, ErrServerError } from "@/shared/errors";
import { RefreshTokenUseCase } from "./refreshTokenUseCase";
import { access } from "fs";

export class RefreshTokenController implements IController{

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { accessToken, refreshToken } = request.body as RefreshTokenRequest

        try {
            await validateInput({ refreshToken, accessToken }, ['refreshToken', 'accessToken']);

            const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)

            const audience = request.ip || 'unknown'

            const { accessToken: access, refreshToken: refresh } = await refreshTokenUseCase.execute({
                accessToken,
                refreshToken,
                audience
            })

            return reply.status(200).send({data: { accessToken: access, refreshToken: refresh } });
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
        const refreshTokenBody = z.object({
            refreshToken: z.string().describe("Refresh token received during authentication"),
            accessToken: z.string().describe("Access token received during authentication"),
        });
    
        return {
            description: "Refresh Token",
            tags: ["Auth"],
            summary: "Refresh Token",
            body: refreshTokenBody,
            response: {
              200: z.object({
                    data: z.object({
                        accessToken: z.string().describe("New access token"),
                        refreshToken: z.string().describe("New refresh token"),
                    }),
                }).describe("Success response"),
            },
        };
    }
};
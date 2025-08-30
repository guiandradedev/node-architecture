import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ActivateUserRequest, SocialAuthRequest, successAuthenticateUserResponse } from "@/modules/user/protocols";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { SocialAuthUseCase } from "./socialAuthUseCase";
import { userTokenResponse } from "@/shared/helpers";
import { IController } from "@/types/services.types";
import z from "zod";
import { socialAuthProviders } from "../../domain/social-auth";

export class SocialAuthController implements IController{

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const {token, provider} = request.body as SocialAuthRequest

        try {
            await validateInput({ token, provider }, ['token', 'provider']);

            const socialLoginUseCase = container.resolve(SocialAuthUseCase)

            const user = await socialLoginUseCase.execute({
                provider,
                token
            })

            return reply.status(200).send({data: userTokenResponse(user)});
        } catch (error) {
            if(error instanceof AppError) {
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
        const authenticateUserBody = z.object({
            token: z.string().describe("Token from the social provider"),
            provider: z.enum(socialAuthProviders).describe("Social provider"),
        });
    
        return {
            description: "Authenticate a user with a social provider",
            tags: ["Auth"],
            summary: "Authenticates a user and returns a token",
            body: authenticateUserBody,
            response: {
                200: successAuthenticateUserResponse,
            },
        };
    }
};
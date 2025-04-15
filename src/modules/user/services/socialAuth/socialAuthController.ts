import { container } from "tsyringe";
import { AppError, ErrInvalidParam, ErrServerError } from "@/shared/errors";
import { ActivateUserRequest, SocialAuthRequest } from "@/modules/user/protocols";
import { FastifyReply, FastifyRequest } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { SocialAuthUseCase } from "./socialAuthUseCase";
import { userTokenResponse } from "@/shared/helpers";

export class SocialAuthController {

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
};
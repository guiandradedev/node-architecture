import { AppError, ErrUnauthorized } from "@/shared/errors";
import { IMiddleware } from "@/types/services.types";
import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";
import { AuthenticateMiddlewareRequest } from "../../protocols/middlewares/AuthenticateMiddlewareDTO";
import { validateInput } from "@/shared/utils/validateInput";
import { container } from "tsyringe";
import { AuthenticateMiddlewareUseCase } from "./AuthenticateMiddlewareUseCase";

export class AuthenticateMiddlewareController implements IMiddleware {

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) throw new ErrUnauthorized();

            const [, accessToken] = authHeader.split(" ");
            if (!accessToken) throw new ErrUnauthorized();

            const authenticateMiddlewareUseCase = container.resolve(AuthenticateMiddlewareUseCase);
            const { user } = await authenticateMiddlewareUseCase.execute({ accessToken });

            request.user = user;
        } catch (err) {
            if(err instanceof AppError) {
                return reply.status(err.status).send({ errors: [err] })
            }
            reply.status(401).send({ message: "Unauthorized" });
        }
    }
};
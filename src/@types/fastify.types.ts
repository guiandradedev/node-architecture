import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { User } from "@/modules/user/domain";

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyBaseLogger, ZodTypeProvider
>;

declare module "fastify" {
    interface FastifyRequest {
        user?: User;
    }
}
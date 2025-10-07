import { container } from "tsyringe";
import { FastifyReply, FastifyRequest, FastifySchema, RouteShorthandOptions } from "fastify";
import { validateInput } from "@/shared/utils/validateInput";
import { IController } from "@/types/services.types";
import z from "zod";

export class ResetPasswordController implements IController{

    async handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        
        return reply.status(200).send({data: 'Password successful changed!'});
    }

    public getProperties(): RouteShorthandOptions {
        return {
            schema: this.getSchema(),
        };
    }

    private getSchema(): FastifySchema {
        const resetPasswordBody = z.object({
        });
    
        return {
            description: "Change password",
            tags: ["Auth"],
            summary: "Change password",
            body: resetPasswordBody,
            response: {
              200: z.object({
                    data: z.string().describe("Success message"),
                }).describe("Success response"),
            },
        };
    }
};
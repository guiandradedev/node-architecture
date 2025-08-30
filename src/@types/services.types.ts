import { FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify';

export interface IController {
    handle(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
    getProperties(): RouteShorthandOptions;
}

export interface UseCaseRequest {}
export interface UseCaseResponse {}

export interface IUseCase {
    execute(data: UseCaseRequest): Promise<UseCaseResponse>;
}
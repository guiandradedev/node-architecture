import 'dotenv/config'; // Private data
import 'reflect-metadata';

import '@/shared/core/container';

import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { routes } from './routes';
import { AppError } from '@/shared/errors';
import { ErrInternalServerError } from '@/shared/errors/ErrInternalServerError';

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: '*' });
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Asadsa',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

app.get('/', () => {
    return 'Hello World';
});

app.setErrorHandler((error, request, reply) => {
    let newError = error as unknown as AppError;
    if (!(error instanceof AppError)) {
        newError = new ErrInternalServerError(error.message)
    }

    return reply.status(newError.status).send({ errors: [newError] });
});


app.register(routes, { prefix: '/api' });
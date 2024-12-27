import 'dotenv/config'; // Private data
import 'reflect-metadata';

import '@/shared/core/container';

import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { routes } from './routes';

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

// Registrar rotas com prefixo /api
app.register(routes, { prefix: '/api' }); // Aqui está a correção

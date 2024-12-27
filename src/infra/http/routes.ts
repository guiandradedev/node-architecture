import { FastifyTypedInstance } from '@/types/fastify.types';

export async function routes(app: FastifyTypedInstance) {
    app.get('/users', {
        schema: {
            tags: ['users'],
            description: "asdsadas"
        }
    }, () => {
        return { message: 'User list' };
    });

    app.get('/status', () => {
        return { status: 'ok' };
    });
}

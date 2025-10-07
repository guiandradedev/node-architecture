import { AuthenticateMiddlewareController } from '@/modules/user/middlewares/authenticate';
import { MeController } from '@/modules/user/services/me/meController';
import { FastifyTypedInstance } from '@/types/fastify.types';

export async function userRoutes(app: FastifyTypedInstance) {

    const meController = new MeController()
    const authenticateMiddlewareController = new AuthenticateMiddlewareController()

    app.get(
        "/me",
        {
            ...meController.getProperties(),
            preHandler: authenticateMiddlewareController.handle.bind(authenticateMiddlewareController)
        },
        meController.handle.bind(meController)
    );
}
import { AuthenticateUserController } from '@/modules/user/services/authenticateUser/authenticateUserController'
import { CreateUserController } from '@/modules/user/services/createUser/createUserController'
import { FastifyTypedInstance } from '@/types/fastify.types';

export async function authRoutes(app: FastifyTypedInstance) {
    // app.get('/users', {
    //     schema: {
    //         tags: ['users'],
    //         description: "asdsadas"
    //     }
    // }, () => {
    //     return { message: 'User list' };
    // });

    // app.get('/status', () => {
    //     return { status: 'ok' };
    // });

    app.post('/', new CreateUserController().handle)
    app.post('/login', new AuthenticateUserController().handle)

}

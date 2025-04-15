import { ActivateUserController } from '@/modules/user/services/activateUser/activateUserController';
import { AuthenticateUserController } from '@/modules/user/services/authenticateUser/authenticateUserController'
import { CreateUserController } from '@/modules/user/services/createUser/createUserController'
import { ForgotPasswordController } from '@/modules/user/services/forgotPassword';
import { ResetPasswordController } from '@/modules/user/services/resetPassword';
import { SocialAuthController } from '@/modules/user/services/socialAuth/socialAuthController';
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
    app.post('/activate', new ActivateUserController().handle)
    app.post('/forgot-password', new ForgotPasswordController().handle)
    app.post('/reset-password', new ResetPasswordController().handle)

    app.post("/social-login", new SocialAuthController().handle);

}

import { ActivateUserController } from '@/modules/user/services/activateUser/activateUserController';
import { AuthenticateUserController } from '@/modules/user/services/authenticateUser/authenticateUserController'
import { CreateUserController } from '@/modules/user/services/createUser/createUserController'
import { ForgotPasswordController } from '@/modules/user/services/forgotPassword';
import { ResetPasswordController } from '@/modules/user/services/resetPassword';
import { SocialAuthController } from '@/modules/user/services/socialAuth/socialAuthController';
import { FastifyTypedInstance } from '@/types/fastify.types';

export async function authRoutes(app: FastifyTypedInstance) {
    const createUserController = new CreateUserController()
    app.post('/', createUserController.getProperties(), createUserController.handle)

    const authenticateUserController = new AuthenticateUserController()
    app.post('/login', authenticateUserController.getProperties(), authenticateUserController.handle)

    const activateUserController = new ActivateUserController()
    app.post('/activate', activateUserController.getProperties(), activateUserController.handle)

    const forgotPasswordController = new ForgotPasswordController()
    app.post('/forgot-password', forgotPasswordController.getProperties(), forgotPasswordController.handle)

    const resetPasswordController = new ResetPasswordController()
    app.post('/reset-password', resetPasswordController.getProperties(), resetPasswordController.handle)

    const socialAuthController = new SocialAuthController()
    app.post("/social-login", socialAuthController.getProperties(), socialAuthController.handle);
}
import { inject, injectable } from "tsyringe";
import { IUserCodeRepository, IUserRepository } from "@/modules/user/repositories";
import { ErrInvalidParam, ErrNotFound } from "@/shared/errors";
import { IMailAdapter } from "@/shared/adapters";
import { IUseCase } from "@/types/services.types";
import { IHashAdapter } from "../../adapters";
import { ResetPasswordRequest, ResetPasswordResponse } from "../../protocols";
import { ErrExpired } from "@/shared/errors/ErrExpired";
import { SendUserMail } from "@/shared/helpers";

@injectable()
export class ResetPasswordUseCase implements IUseCase{
    constructor(
        @inject('UsersRepository')
        private userRepository: IUserRepository,

        @inject('UserCodeRepository')
        private userCodeRepository: IUserCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: IMailAdapter,

        @inject('HashAdapter')
        private hashAdapter: IHashAdapter,
    ) { }

    async execute({ code, password, confirmPassword }: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        const codeExists = await this.userCodeRepository.findByCode({ code, type: 'FORGOT_PASSWORD' })
        if (!codeExists) throw new ErrInvalidParam('code')

        if (codeExists.props.expiresIn < new Date() || codeExists.props.active == false) {
            throw new ErrExpired('code')
        }

        if (password !== confirmPassword) throw new ErrInvalidParam('password and confirmPassword')

        const passwordHash = await this.hashAdapter.hash(password)
        password = passwordHash;

        const user = await this.userRepository.changePassword({ userId: codeExists.props.userId, password })

        if (!user) throw new ErrNotFound('user')

        const sendUserMail = new SendUserMail(this.mailAdapter)
        await sendUserMail.passwordResetConfirmationMail({ to: user.props.email })

        return user
    }
}
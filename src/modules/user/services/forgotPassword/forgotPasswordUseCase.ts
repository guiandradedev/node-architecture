import { inject, injectable } from "tsyringe";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "@/modules/user/protocols";
import { IUserCodeRepository, IUserRepository } from "@/modules/user/repositories";
import { ErrAlreadyActive, ErrNotActive, ErrNotFound } from "@/shared/errors";
import { CreateUserCodeService } from "@/modules/user/utils/UserCode";
import { IMailAdapter } from "@/shared/adapters";
import { IUseCase } from "@/types/services.types";

@injectable()
export class ForgotPasswordUseCase implements IUseCase{
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('UserCodeRepository')
        private userCodeRepository: IUserCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: IMailAdapter
    ) { }

    async execute({ email }: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        const userExists = await this.userRepository.findByEmail(email)
        if (!userExists) throw new ErrNotFound('user')

        await this.userCodeRepository.deleteAllUserCode(userExists.id, "FORGOT_PASSWORD")
        
        if (!userExists.props.account_activate_at) {
            //resend activate email here
            const createUserCode = new CreateUserCodeService(this.userRepository, this.userCodeRepository, this.mailAdapter)
            
            const code = await createUserCode.execute({ user: userExists, type: "ACTIVATE_ACCOUNT" })

            throw new ErrNotActive('user')
        }

        const createUserCode = new CreateUserCodeService(this.userRepository, this.userCodeRepository, this.mailAdapter)
        
        const userCode = await createUserCode.execute({ user: userExists, type: "FORGOT_PASSWORD"})

        return userCode
    }
}
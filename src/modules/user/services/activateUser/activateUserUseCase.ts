import { inject, injectable } from "tsyringe";
import { IUserCodeRepository, IUserRepository } from "@/modules/user/repositories";
import { ErrAlreadyActive, ErrInvalidParam, ErrNotFound } from "@/shared/errors";
import { UserCode } from "@/modules/user/domain";
import { ErrExpired } from "@/shared/errors/ErrExpired";
import { ActivateUserRequest, ActivateUserResponse } from "@/modules/user/protocols";
import { IMailAdapter } from "@/shared/adapters";
import { CreateUserCodeService } from "@/modules/user/utils";

@injectable()
export class ActivateUserUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('UserCodeRepository')
        private userCodeRepository: IUserCodeRepository,

        @inject('MailAdapter')
        private mailAdapter: IMailAdapter
    ) { }

    
    async execute({ code, userId }: ActivateUserRequest): Promise<ActivateUserResponse> {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new ErrNotFound('user')

        if (userExists.props.account_activate_at) throw new ErrAlreadyActive('user')

        const codeExists = await this.userCodeRepository.findByCodeAndUserId({ code, userId, type: 'ACTIVATE_ACCOUNT' })
        if (!codeExists) throw new ErrExpired('code')

        if (codeExists.props.expiresIn < new Date() || codeExists.props.active == false) {
            await this.userCodeRepository.changeCodeStatus(codeExists.id)
            
            const createUserCode = new CreateUserCodeService(this.userRepository, this.userCodeRepository, this.mailAdapter)
            
            await createUserCode.execute({ user: userExists, type: "ACTIVATE_ACCOUNT" })

            throw new ErrExpired('code')
        }

        await this.userCodeRepository.changeCodeStatus(codeExists.id)
        await this.userRepository.changeStatus(userExists.id)

        return codeExists

    }
}
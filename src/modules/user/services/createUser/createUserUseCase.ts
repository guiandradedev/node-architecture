import { IHashAdapter } from "@/modules/user/adapters/HashAdapter";
import { User } from "@/modules/user/domain";
import { CreateUserRequest } from "@/modules/user/protocols";
import { IUserRepository } from "@/modules/user/repositories";
import { IMailAdapter } from "@/shared/adapters/MailAdapter";
import { ErrAlreadyExists } from "@/shared/errors";
import { SendUserMail } from "@/shared/helpers/mail";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject('UserRepository')
        private readonly userRepository: IUserRepository,
        @inject('HashAdapter')
        private readonly hashAdapter: IHashAdapter,
        @inject('MailAdapter')
        private readonly mailAdapter: IMailAdapter,
    ) { }

    async execute({ name, email, password, role, createdAt }: CreateUserRequest): Promise<User> {
        const userMailExists = await this.userRepository.findByEmail(email)
        if (userMailExists) throw new ErrAlreadyExists('User')

        const passwordHash = await this.hashAdapter.hash(password)
        password = passwordHash;

        const user = User.create({
            name,
            createdAt: createdAt ?? new Date(),
            email,
            password,
            role: role ?? "USER",
        })

        await this.userRepository.create(user)

        return user
    }
}
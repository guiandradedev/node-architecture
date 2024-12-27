import { GenerateUserCode, TypeCode } from "./GenerateUserCode";
import { UserCode } from "@/modules/user/domain";
import { IUserCodeRepository, IUserRepository } from "@/modules/user/repositories";
import { IMailAdapter } from "@/shared/adapters";
import { GenerateUserDTO } from "@/modules/user/protocols";
import { SendUserMail } from "@/shared/helpers";

export class CreateUserCodeService {
    constructor(
            private readonly userRepository: IUserRepository,
            private userCodeRepository: IUserCodeRepository,
            private readonly mailAdapter: IMailAdapter,
        ) { }

    async execute({ user }: GenerateUserDTO): Promise<void> {
        const generateUserCode = new GenerateUserCode()
        
        const date = new Date();
        date.setHours(date.getHours() + 3);

        const { code, expiresIn } = generateUserCode.execute({ type: TypeCode.string, size: 6, expiresIn: date })

        const userCode = UserCode.create({
            active: true,
            code,
            expiresIn,
            createdAt: new Date(),
            userId: user.id,
            type: "ACTIVATE_ACCOUNT"
        })
        await this.userCodeRepository.create(userCode)

        const sendUserMail = new SendUserMail(this.mailAdapter)
        await sendUserMail.authMail({ to: user.props.email, code })
    }
}
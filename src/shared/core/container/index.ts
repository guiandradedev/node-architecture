import { BcryptHashAdapter, IHashAdapter } from "@/modules/user/adapters/hash";
import { ISecurityAdapter } from "@/modules/user/adapters/security/ISecurityAdapter";
import { JwtSecurityAdapter } from "@/modules/user/adapters/security/implementations/JwtSecurityAdapter";
import { PrismaUserCodeRepository, PrismaUserRepository, PrismaUserTokenRepository } from "@/modules/user/infra/repositories/prisma";
import { PrismaSocialAuthRepository } from "@/modules/user/infra/repositories/prisma/PrismaSocialAuthRepository";
import { IUserTokenRepository, IUserRepository, IUserCodeRepository, ISocialAuthRepository } from "@/modules/user/repositories";
import { GoogleAuthProvider } from "@/modules/user/utils/SocialAuthProvider/GoogleAuthProvider";
import { ISocialAuthProvider } from "@/modules/user/utils/SocialAuthProvider/ISocialAuthProvider";
import { IMailAdapter, NodemailerMailAdapter } from "@/shared/adapters";
import { IPaymentAdapter, StripeCheckoutPaymentAdapter } from "@/shared/adapters/PaymentAdapter";
import { container } from "tsyringe";

container.register<ISocialAuthProvider>("GoogleAuthProvider", { useClass: GoogleAuthProvider });

container.registerSingleton<IUserRepository>(
    "UserRepository",
    PrismaUserRepository
)

container.registerInstance<IHashAdapter>(
    "HashAdapter",
    new BcryptHashAdapter(12)
)

container.registerSingleton<IUserTokenRepository>(
    "UserTokenRepository",
    PrismaUserTokenRepository
)
container.registerSingleton<ISocialAuthRepository>(
    "SocialAuthRepository",
    PrismaSocialAuthRepository
)

container.registerSingleton<IUserCodeRepository>(
    "UserCodeRepository",
    PrismaUserCodeRepository
)

container.registerSingleton<ISecurityAdapter>(
    "SecurityAdapter",
    JwtSecurityAdapter
)

const nodemaileradapter = new NodemailerMailAdapter()
container.registerInstance<IMailAdapter>(
    "MailAdapter",
    nodemaileradapter
)
const stripecheckout_adapter = new StripeCheckoutPaymentAdapter()
container.registerInstance<IPaymentAdapter>(
    "PaymentAdapter",
    stripecheckout_adapter
)
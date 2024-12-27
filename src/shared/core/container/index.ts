import { BcryptHashAdapter, IHashAdapter } from "@/modules/user/adapters/hash";
import { ISecurityAdapter } from "@/modules/user/adapters/security/ISecurityAdapter";
import { JwtSecurityAdapter } from "@/modules/user/adapters/security/implementations/JwtSecurityAdapter";
import { PrismaUserTokenRepository } from "@/modules/user/infra/repositories/prisma";
import { PrismaUserRepository } from "@/modules/user/infra/repositories/prisma/PrismaUserRepository";
import { IUserTokenRepository, IUserRepository, IUserCodeRepository } from "@/modules/user/repositories";
import { container } from "tsyringe";

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

container.registerSingleton<IUserCodeRepository>(
    "UserCodeRepository",
    PrismaUserCodeRepository
)

container.registerSingleton<ISecurityAdapter>(
    "SecurityAdapter",
    JwtSecurityAdapter
)
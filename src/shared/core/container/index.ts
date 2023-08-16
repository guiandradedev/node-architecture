import { BcryptHashAdapter, IHashAdapter } from "@/modules/user/adapters/HashAdapter";
import { ISecurityAdapter } from "@/modules/user/adapters/SecurityAdapter/ISecurityAdapter";
import { JwtSecurityAdapter } from "@/modules/user/adapters/SecurityAdapter/implementations/JwtSecurityAdapter";
import { PrismaAuthTokenRepository } from "@/modules/user/infra/repositories/prisma";
import { PrismaUserRepository } from "@/modules/user/infra/repositories/prisma/PrismaUserRepository";
import { IAuthTokenRepository, IUserRepository } from "@/modules/user/repositories";
import { container } from "tsyringe";

container.registerSingleton<IUserRepository>(
    "UserRepository",
    PrismaUserRepository
)

container.registerInstance<IHashAdapter>(
    "HashAdapter",
    new BcryptHashAdapter(12)
)

container.registerSingleton<IAuthTokenRepository>(
    "AuthTokenRepository",
    PrismaAuthTokenRepository
)

container.registerSingleton<ISecurityAdapter>(
    "SecurityAdapter",
    JwtSecurityAdapter
)
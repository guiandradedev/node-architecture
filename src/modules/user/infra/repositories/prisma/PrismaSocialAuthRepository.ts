import { prismaClient } from "@/infra/providers/database/prisma";
import { UserToken } from "@/modules/user/domain";
import { SocialAuth, SocialAuthProvider } from "@/modules/user/domain/social-auth";
import { prismaSocialAuthToEntity, prismaUserTokenToEntity } from "@/modules/user/mappers/prisma";
import { ISocialAuthRepository } from "@/modules/user/repositories";


export class PrismaSocialAuthRepository implements ISocialAuthRepository {
    async create(data: SocialAuth): Promise<void> {
        await prismaClient.socialAuth.create({ data: { ...data.props, id: data.id } })
    }
    async findByProvider(provider: SocialAuthProvider, id: string): Promise<SocialAuth> {
        const socialAuth = await prismaClient.socialAuth.findFirst({
            where: {
                provider,
                providerId: id
            }
        })
        if(!socialAuth) return null;
        return prismaSocialAuthToEntity(socialAuth);
    }
    
}
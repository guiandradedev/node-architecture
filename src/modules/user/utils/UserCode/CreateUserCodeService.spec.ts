import 'reflect-metadata'
import 'dotenv/config'
import { describe, expect, it, vitest } from "vitest";
import { InMemoryUserCodeRepository, InMemoryUserRepository, InMemoryUserTokenRepository } from '@/tests/repositories'
import { CreateUserCodeService } from './CreateUserCodeService';
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters'
import { CreateUserUseCase } from '../../services/createUser/createUserUseCase';

describe("Create UserCode Service", async () => {
    
    const makeSut = async () => {
        const mailAdapter = new InMemoryMailAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userRepository = new InMemoryUserRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const userAdapter = new CreateUserUseCase(userRepository, userTokenRepository, userCodeRepository, hashAdapter, mailAdapter, securityAdapter)
        
        const sut = new CreateUserCodeService(userRepository, userCodeRepository, mailAdapter)

        return { userRepository, sut, userTokenRepository, securityAdapter, hashAdapter, userCodeRepository, userAdapter }
    }

    it('should not throw an error', async () => {
        const { userAdapter, sut, userCodeRepository } = await makeSut();

        const user = await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
        })
        const response = sut.execute({ user, type: "ACTIVATE_ACCOUNT" })

        await expect(response).resolves.not.toThrow()
    })
    
})
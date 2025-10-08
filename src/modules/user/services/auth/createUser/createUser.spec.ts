import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { CreateUserUseCase } from './createUserUseCase'
import { User } from '@/modules/user/domain'
import { ErrAlreadyExists, ErrInvalidParam } from '@/shared/errors'
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters'
import { InMemoryUserCodeRepository, InMemoryUserRepository } from '@/tests/repositories'
import { SecurityDecryptResponse } from '@/modules/user/adapters'

describe('Create User', () => {

    const makeSut = () => {
        const mailAdapter = new InMemoryMailAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userRepository = new InMemoryUserRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const sut = new CreateUserUseCase(userRepository, userCodeRepository, hashAdapter, mailAdapter, securityAdapter)

        return { userRepository, sut, securityAdapter, hashAdapter, userCodeRepository }
    }

    it('should create an user', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            password: "teste123"
        })

        expect(response).toMatchObject({
            token: {
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            }
        })
    })

    it('should not create another user (email)', async () => {
        const { sut } = makeSut()

        await sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            password: "teste123"
        })

        const user = sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            password: "teste123"
        })

        await expect(user).rejects.toBeInstanceOf(ErrAlreadyExists)
    })

    it('should not create user if email is invalid', async () => {
        const { sut } = makeSut();

        const dataUser = {
            name: "valid name",
            email: "invalid_email",
            password: "teste123"
        };

        const response = sut.execute(dataUser);

        await expect(response).rejects.toBeInstanceOf(ErrInvalidParam);
    });

    it('should return an access and refresh token valids', async () => {
        const { sut, securityAdapter } = makeSut();

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
        })

        const verifyAccess = await securityAdapter.decrypt(user.token.accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: expect.any(String), // nao tenho acesso ao id do user aqui
            payload: expect.any(Object)
        })
    })
})
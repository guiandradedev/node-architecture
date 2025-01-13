import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { User } from '@/modules/user/domain'
import { ErrInvalidParam, ErrNotActive } from '@/shared/errors'
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters'
import { InMemoryUserCodeRepository, InMemoryUserRepository, InMemoryUserTokenRepository } from '@/tests/repositories'
import { CreateUserUseCase, AuthenticateUserUseCase } from '@/modules/user/services'
import { UserTokenResponse } from '@/modules/user/protocols'
import { SecurityDecryptResponse } from '@/modules/user/adapters'

describe('Authentication', async () => {
    const makeSut = () => {
        const mailAdapter = new InMemoryMailAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userRepository = new InMemoryUserRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const userAdapter = new CreateUserUseCase(userRepository, userTokenRepository, userCodeRepository, hashAdapter, mailAdapter, securityAdapter)
        
        const sut = new AuthenticateUserUseCase(userRepository, userTokenRepository, hashAdapter, securityAdapter)

        return {
            userRepository,
            userTokenRepository,
            hashAdapter,
            mailAdapter,
            securityAdapter,
            userAdapter,
            sut
        }
    }


    it('Authenticate User', async () => {
        const { userAdapter, sut } = makeSut();

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            account_activate_at: new Date()
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user).toBeInstanceOf(User)
    })

    it('should throw an error if user is not active', async () => {
        const { userAdapter, sut } = makeSut();

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            // cpf: "736.754.940-55"
        })

        const user = sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        await expect(user).rejects.toBeInstanceOf(ErrNotActive)
    })

    it('Should throw an error if user does not exists', async () => {
        const { sut } = makeSut()

        const response = sut.execute({
            email: "fake_email@email.com",
            password: "fake_password"
        })

        await expect(response).not.toBeInstanceOf(User)
        await expect(response).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('Should throw an error if password != user.password', async () => {
        const { sut, userAdapter } = makeSut()

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
        })

        const response = sut.execute({
            email: "fake_email@email.com",
            password: "fake_password"
        })

        await expect(response).not.toBeInstanceOf(User)
        await expect(response).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('should return an access and refresh token valids', async () => {
        const { userAdapter, sut, securityAdapter } = makeSut();

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            account_activate_at: new Date()
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user.token).toMatchObject<UserTokenResponse>({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })

        const verifyAccess = await securityAdapter.decrypt(user.token.accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: user.id,
            // payload: {
            //     id: user.id,
            //     email: user.props.email,
            //     role: user.props.role
            // }
        })
    })

})
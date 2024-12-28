import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { CreateUserUseCase } from './createUserUseCase'
import { User, UserToken } from '@/modules/user/domain'
import { ErrAlreadyExists, ErrInvalidParam } from '@/shared/errors'
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters'
import { InMemoryUserCodeRepository, InMemoryUserRepository, InMemoryUserTokenRepository } from '@/tests/repositories'
import { UserTokenResponse } from '@/modules/user/protocols'
import { SecurityDecryptResponse } from '@/modules/user/adapters'

describe('Create User', () => {

    const makeSut = () => {
        const mailAdapter = new InMemoryMailAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userRepository = new InMemoryUserRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const sut = new CreateUserUseCase(userRepository, userTokenRepository, userCodeRepository, hashAdapter, mailAdapter, securityAdapter)

        return { userRepository, sut, userTokenRepository, securityAdapter, hashAdapter, userCodeRepository }
    }

    it('should create an user', async () => {
        const { sut } = makeSut()

        const user = await sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            password: "teste123"
        })

        expect(user).toBeInstanceOf(User)
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
        const { sut, securityAdapter, userTokenRepository } = makeSut();

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
        })

        await expect(userTokenRepository.findByToken(user.token.refreshToken)).resolves.toBeInstanceOf(UserToken)
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
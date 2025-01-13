import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { UserCode } from '@/modules/user/domain'
import { ErrNotActive, ErrNotFound } from '@/shared/errors'
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters'
import { InMemoryUserCodeRepository, InMemoryUserRepository, InMemoryUserTokenRepository } from '@/tests/repositories'
import { CreateUserUseCase } from '@/modules/user/services'
import { ForgotPasswordUseCase } from './forgotPasswordUseCase'

describe('Forgot Password', () => {
    const makeSut = async () => {
        const mailAdapter = new InMemoryMailAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userRepository = new InMemoryUserRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const userAdapter = new CreateUserUseCase(userRepository, userTokenRepository, userCodeRepository, hashAdapter, mailAdapter, securityAdapter)
        
        const user = await userAdapter.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123",
            account_activate_at: new Date()
        })

        const sut = new ForgotPasswordUseCase(userRepository, userCodeRepository, mailAdapter)

        return { sut, userRepository, user, userAdapter, userCodeRepository, mailAdapter }
    }

    it('should forgot password', async () => {
        const { sut, user } = await makeSut()

        const code = await sut.execute({
            email: user.props.email
        })

        expect(code).toBeInstanceOf(UserCode)
    })
    // it('should soft delete all unused codes', async () => {
    //     const { sut, user } = await makeSut()

    //     await sut.execute({
    //         email: user.props.email
    //     })
    //     await sut.execute({
    //         email: user.props.email
    //     })

    //     expect(code).toBeInstanceOf(UserCode)
    // })

    it('should throw an error if user does not exists', async () => {
        const { sut } = await makeSut()

        const code = sut.execute({
            email: 'invalid_email@mail.com'
        })

        await expect(code).rejects.toBeInstanceOf(ErrNotFound)
    })

    it('should throw an error if user is not active', async () => {
        const { userAdapter, sut } = await makeSut()
        await userAdapter.execute({
            email: "not_active_mail@gmail.com",
            name: "invalid_name",
            password: "invalid_password"
        })

        const code = sut.execute({
            email: 'not_active_mail@gmail.com'
        })

        await expect(code).rejects.toBeInstanceOf(ErrNotActive)
    })
})
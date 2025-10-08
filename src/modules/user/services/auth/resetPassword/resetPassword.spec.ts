import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect, vitest } from 'vitest'
import { User } from '@/modules/user/domain'
import { ErrInvalidParam } from '@/shared/errors'
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters'
import { InMemoryUserCodeRepository, InMemoryUserRepository } from '@/tests/repositories'
import { CreateUserUseCase } from '@/modules/user/services'
import { ResetPasswordUseCase } from './resetPasswordUseCase'
import { ForgotPasswordUseCase } from '../forgotPassword'
import { GenerateUserCode } from '@/modules/user/utils'
import { ErrExpired } from '@/shared/errors'

describe('Reset Password', () => {
    const makeSut = async () => {
        const mailAdapter = new InMemoryMailAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userRepository = new InMemoryUserRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const userAdapter = new CreateUserUseCase(userRepository, userCodeRepository, hashAdapter, mailAdapter, securityAdapter)
        const data = { email: "teste@teste.com", name: "Flaamer", password: "teste123" }
        const response = await userAdapter.execute({
            ...data,
            account_activate_at: new Date()
        })

        const user = await userRepository.findByEmail(data.email)

        const forgotPasswordAdapter = new ForgotPasswordUseCase(userRepository, userCodeRepository, mailAdapter)

        const code = await forgotPasswordAdapter.execute({
            email: data.email
        })

        const sut = new ResetPasswordUseCase(userRepository, userCodeRepository, mailAdapter, hashAdapter)

        return { forgotPasswordAdapter, userRepository, code, user, userAdapter, userCodeRepository, mailAdapter, hashAdapter, sut, data }
    }

    it('should reset password', async () => {
        const { sut, code, user, hashAdapter, data } = await makeSut()

        let oldPassword = data.password
        const password = "password"

        const reset = await sut.execute({
            code: code.props.code,
            password,
            confirmPassword: password,
            email: data.email
        })

        expect(reset).toBeInstanceOf(User)
        // expect(data.password).toBe(await hashAdapter.hash(password))
        // expect(user.props.password).not.toBe(oldPassword)
    })

    it('should throw an error if code is invalid', async () => {
        const { sut, user, data } = await makeSut()

        const reset = sut.execute({
            code: "invalid_code",
            password: "password",
            confirmPassword: "password",
            email: data.email
        })

        await expect(reset).rejects.toBeInstanceOf(ErrInvalidParam)
    })
    it('should throw an error if code expired', async () => {
        const { sut, userAdapter, forgotPasswordAdapter, user } = await makeSut()
        
        const response = await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "Guilherme",
            password: "teste123",
            account_activate_at: new Date()
        })
        const generateActivateCode = vitest.spyOn(GenerateUserCode.prototype, 'execute')
        const date = new Date()
        date.setDate(date.getDate() - 1)
        generateActivateCode.mockImplementationOnce(() => { return { code: '', expiresIn: date } });
        
        const code = await forgotPasswordAdapter.execute({
            email: user.props.email
        })

        // const sut = new ResetPasswordUseCase(usersRepository, userCodeRepository, mailAdapter, hashAdapter)

        const password = "password"

        const reset = sut.execute({
            code: code.props.code,
            password,
            confirmPassword: password,
            email: user.props.email
        })

        await expect(reset).rejects.toBeInstanceOf(ErrExpired)
    })


    it('should throw an error if password and confirm password does not match', async () => {
        const { sut, code, user } = await makeSut()

        const reset = sut.execute({
            code: code.props.code,
            password: 'valid_password',
            confirmPassword: 'invalid_password',
            email: user.props.email
        })

        await expect(reset).rejects.toBeInstanceOf(ErrInvalidParam)
    })
})
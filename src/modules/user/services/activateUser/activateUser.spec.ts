import 'dotenv/config'
import 'reflect-metadata'
import { describe, it, expect, vitest } from 'vitest'
import { UserCode } from '@/modules/user/domain'
import { ErrAlreadyActive, ErrInvalidParam, ErrNotFound } from '@/shared/errors'
import { InMemoryHashAdapter, InMemoryMailAdapter, InMemorySecurityAdapter } from '@/tests/adapters'
import { InMemoryUserCodeRepository, InMemoryUserRepository, InMemoryUserTokenRepository } from '@/tests/repositories'
import { CreateUserUseCase } from '@/modules/user/services'
import { ActivateUserUseCase } from './activateUserUseCase'
import { GenerateUserCode } from '../../utils'
import { ErrExpired } from '@/shared/errors/ErrExpired'

describe("ActivateUserCode", () => {
    const makeSut = async () => {
        const mailAdapter = new InMemoryMailAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userRepository = new InMemoryUserRepository()
        const userTokenRepository = new InMemoryUserTokenRepository()
        const userCodeRepository = new InMemoryUserCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const sutUser = new CreateUserUseCase(userRepository, userTokenRepository, userCodeRepository, hashAdapter, mailAdapter, securityAdapter)
       
        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste@teste.com",
            password: "teste123"
        })

        const code = await userCodeRepository.findByUserId({userId: user.id, type: 'ACTIVATE_ACCOUNT'})

        const sut = new ActivateUserUseCase(userRepository, userCodeRepository, mailAdapter)

        return { sut, userRepository, user, code, sutUser, userCodeRepository, mailAdapter }
    }
    it('should activate an user if code is valid', async () => {
        const { sut, user, code, userRepository } = await makeSut();

        const activateUser = await sut.execute({
            userId: user.id,
            code: code.props.code
        })

        expect(activateUser).toBeInstanceOf(UserCode)
        
        const validateUser = await userRepository.findById(activateUser.props.userId)
        expect(validateUser.props.account_activate_at.getTime()).toBeCloseTo(new Date().getTime(), -2);
    })

    it('should throw an error if user does not exists', async () => {
        const { sut, code } = await makeSut();

        const activateCode = sut.execute({
            userId: 'fake_user_id',
            code: code.props.code
        })

        await expect(activateCode).rejects.toBeInstanceOf(ErrNotFound)
    })

    it('should throw an error if user code not exists', async () => {
        const { sut, user, code } = await makeSut();

        const activateCode = sut.execute({
            userId: user.id,
            code: "fake_code"
        })

        await expect(activateCode).rejects.toBeInstanceOf(ErrExpired)
    })

    it('should throw an error if code expired', async () => {
        const { sutUser, userCodeRepository, userRepository, mailAdapter } = await makeSut();

        const generateActivateCode = vitest.spyOn(GenerateUserCode.prototype, 'execute')
        const date = new Date()
        date.setDate(date.getDate() - 3)
        generateActivateCode.mockImplementationOnce(() => { return { code: '', expiresIn: date } });

        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste1@teste.com",
            password: "teste123"
        })
        const code = await userCodeRepository.findByUserId({userId: user.id, type: 'ACTIVATE_ACCOUNT'})

        const sut = new ActivateUserUseCase(userRepository, userCodeRepository, mailAdapter)

        const activateCode = sut.execute({
            userId: user.id,
            code: code.props.code
        })

        await expect(activateCode).rejects.toBeInstanceOf(ErrExpired)

    })

    it('should throw an error if user already active', async () => {
        const { sut, sutUser, userCodeRepository } = await makeSut();
        const user = await sutUser.execute({
            name: "Flaamer",
            email: "teste1@teste.com",
            password: "teste123",
            account_activate_at: new Date()
        })

        const activateUser = sut.execute({
            userId: user.id,
            code: 'fake_code'
        })

        await expect(activateUser).rejects.toBeInstanceOf(ErrAlreadyActive)

    })

})
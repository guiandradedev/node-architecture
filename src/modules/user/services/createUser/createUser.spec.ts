import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import 'reflect-metadata'
import { InMemoryUserRepository } from '@/modules/user/repositories/inMemory/InMemoryUserRepository'
import { CreateUserUseCase } from './createUserUseCase'
import { User } from '@/modules/user/domain'
import { ErrAlreadyExists, ErrInvalidParam } from '@/shared/errors'
import { InMemoryHashAdapter } from '@/modules/user/adapters/HashAdapter'
import { InMemoryMailAdapter } from '@/shared/adapters/MailAdapter'

describe('Create User', () => {

    const makeSut = async () => {
        const userRepository = new InMemoryUserRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const mailAdapter = new InMemoryMailAdapter()
        const sut = new CreateUserUseCase(userRepository, hashAdapter, mailAdapter)

        return { userRepository, sut }
    }

    it('should create an user', async () => {
        const { sut } = await makeSut()

        const user = await sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            password: "teste123"
        })

        expect(user).toBeInstanceOf(User)
    })

    it('should not create another user (email)', async () => {
        const { sut } = await makeSut()

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

        expect(user).rejects.toBeInstanceOf(ErrAlreadyExists)
    })
})
import 'dotenv/config'
import { ISecurityAdapter, SecurityDecryptResponse } from '@/modules/user/adapters/security/ISecurityAdapter';
import { describe, expect, it, vitest } from "vitest";
import { CreateSession, CreateSessionRequest } from './SessionService';
import { InMemorySecurityAdapter } from '@/modules/user/adapters/security/implementations/InMemorySecurityAdapter';

describe("Session Service", async () => {
    type TypeSut = {
        securityAdapter: ISecurityAdapter
        createSession: CreateSession
    }
    const makeSut = (securityAdapter: ISecurityAdapter = new InMemorySecurityAdapter()): TypeSut => {
        const createSession = new CreateSession(securityAdapter)
        return { securityAdapter, createSession }
    }
    it('should create a valid token and refresh_token', async () => {
        const { createSession, securityAdapter } = makeSut()
        const user: CreateSessionRequest = {email: 'fake_email@email.com', id: "fake_user_id"}
        const { accessToken, refreshToken } = await createSession.execute(user)

        const verifyAccess = await securityAdapter.decrypt(accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: user.id,
            // payload: {
            //     id: user.id,
            //     email: user.email,
            //     role: user.role
            // }
        })

        expect(verifyAccess.expiresIn.getTime()).toBeGreaterThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN) - 1000)

        const verifyRefresh = await securityAdapter.decrypt(refreshToken, process.env.REFRESH_TOKEN)
        expect(verifyRefresh).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: user.id,
            // payload: {
            //     email: user.email,
            // }
        })
        expect(verifyRefresh.expiresIn.getTime()).toBeGreaterThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_REFRESH_TOKEN) - 1000)
    })

    // it('should throw an error if an adapter error occurs', async () => {
    //     const { createSession, securityAdapter } = makeSut()

    //     vitest.spyOn(securityAdapter, 'encrypt').mockRejectedValueOnce(Promise.all((resolve, rejects)=>rejects(new Error())))


    //     const a = createSession.execute({email: 'fake_email@email.com', id: "fake_user_id", role: "USER"})

    //     expect(a).rejects.toBeInstanceOf(AppError)
    // })
})
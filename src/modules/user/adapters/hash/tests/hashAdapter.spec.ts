import { describe, expect, it } from "vitest";
import { InMemoryHashAdapter } from "../implementations";

describe('Hash Adapter', () => {
    it('should return an hashed password', async () => {
        const sut = new InMemoryHashAdapter()

        const password = await sut.hash('password')
        expect(password).toEqual('hashed_value')
    })

    it('should return true if password is valid', async () => {
        const sut = new InMemoryHashAdapter()
        await sut.hash('password')

        const password = await sut.compare('password', 'hashed_value')
        expect(password).toEqual(true)
    })
})
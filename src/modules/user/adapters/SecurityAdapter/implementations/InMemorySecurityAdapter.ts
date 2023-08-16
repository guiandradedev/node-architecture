import { v4 as uuidv4 } from 'uuid'
import { ISecurityAdapter, SecurityDecryptResponse } from '../ISecurityAdapter'

interface EncryptOptions {
    subject: string,
    expiresIn: number
}

interface Tokens extends SecurityDecryptResponse {
    id: string
}

export class InMemorySecurityAdapter implements ISecurityAdapter {
    private tokens: Tokens[] = []
    async encrypt(data: any, secret: string, options: EncryptOptions): Promise<string> {
        const token: Tokens = {
            id: uuidv4(),
            payload: {...data},
            subject: options.subject,
            expiresIn: new Date(Date.now() + Number(options.expiresIn)),
            issuedAt: new Date(),
        }
        this.tokens.push(token)
        return token.id;
    }
    async decrypt(value: string, secret: string): Promise<SecurityDecryptResponse> {
        const data = this.tokens.find(token=>token.id == value)

        if(!data) return null

        return {
            payload: {...data.payload},
            subject: data.subject,
            expiresIn: data.expiresIn,
            issuedAt: data.issuedAt
        }
    }
}
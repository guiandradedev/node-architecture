import { SecurityDecryptResponse, ISecurityAdapter } from "@/modules/user/adapters";
import { v4 as uuidv4 } from 'uuid'

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
            subject: options.subject,
            expiresIn: new Date(Date.now() + Number(options.expiresIn)),
            issuedAt: new Date()
        }
        this.tokens.push(token)
        return token.id;
    }
    async decrypt(value: string, secret: string): Promise<SecurityDecryptResponse> {
        const data = this.tokens.find(token=>token.id == value)

        if(!data) return null

        return {
            subject: data.subject,
            expiresIn: data.expiresIn,
            issuedAt: data.issuedAt
        }
    }
}
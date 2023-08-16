import { ErrInvalidParam, ErrMissingParam, ErrServerError } from "@/shared/errors"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ISecurityAdapter, SecurityDecryptResponse } from "../ISecurityAdapter"

interface EncryptOptions {
    subject: string,
    expiresIn: Date | number
}

export class JwtSecurityAdapter implements ISecurityAdapter {
    private mapper(data: JwtPayload): SecurityDecryptResponse {
        const { aud, exp, iat, iss, jti, nbf, sub, ...rest } = data
        return {
            payload: { ...rest },
            subject: sub,
            expiresIn: new Date(exp),
            issuedAt: new Date(iat),
        }
    }
    async encrypt(data: any, secret: string, options: EncryptOptions): Promise<string> {
        const opt: jwt.SignOptions = {
            expiresIn: new Date(options.expiresIn).getTime(),
            subject: options.subject
        }
        return jwt.sign(data, secret, opt)
    }
    async decrypt(value: string, secret: string): Promise<SecurityDecryptResponse> {
        try {
            const data = jwt.verify(value, secret) as JwtPayload

            return this.mapper(data)
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "jwt expired" || error.message === "invalid signature") {
                    throw new ErrInvalidParam('token')
                }
                if (error.message == 'jwt must be provided') {
                    throw new ErrMissingParam('token')
                }
                throw new ErrServerError()
            }
            throw new ErrServerError()
        }
    }
}
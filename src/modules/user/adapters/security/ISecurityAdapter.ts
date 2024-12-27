export type SecurityDecryptResponse = {
    subject: string,
    // payload: any,
    expiresIn: Date,
    issuedAt: Date,
}

export interface ISecurityAdapter {
    encrypt(data: any, secret: string, options: any): Promise<string>;
    decrypt(value: string, secret: string): Promise<SecurityDecryptResponse>;
}
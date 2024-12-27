import { CreateMailConnectionRequest, IMailAdapter, SendMailRequest } from "@/shared/adapters";

export class InMemoryMailAdapter implements IMailAdapter {
    async sendMail(_options: SendMailRequest | SendMailRequest & CreateMailConnectionRequest): Promise<void> {
    }
}
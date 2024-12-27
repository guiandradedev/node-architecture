import { CreateMailConnectionRequest, IMailAdapter, SendMailRequest } from "../IMailAdapter"

export class InMemoryMailAdapter implements IMailAdapter {
    private message: any[] = []
    async sendMail(_options: SendMailRequest | SendMailRequest & CreateMailConnectionRequest): Promise<void> {
        const {body, from, subject, text, to} = _options
        this.message.push({
            to,
            subject,
            from,
            text,
            body
        });

    }
}
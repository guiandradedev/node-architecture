import { OAuth2Client } from "google-auth-library";
import { ISocialAuthProvider, SocialAuthValidateDTO } from "./ISocialAuthProvider";
import { injectable } from "tsyringe";

@injectable()
export class GoogleAuthProvider implements ISocialAuthProvider {
    private client: OAuth2Client;

    constructor() {
      this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async validate(token: string): Promise<SocialAuthValidateDTO> {
        const ticket = await this.client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();

        if (!payload) return null;

        console.log(payload)

        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name
        };
    }
}

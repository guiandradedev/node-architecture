export type SocialAuthValidateDTO = {
  id: string;
  email: string; 
  name: string 
}

export interface ISocialAuthProvider {
  validate(token: string): Promise<SocialAuthValidateDTO | null>;
}
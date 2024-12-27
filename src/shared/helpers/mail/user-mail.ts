export type AuthMailRequest = {
    to: string,
    code: string | number,
}

export type TypePasswordResetConfirmationMail = {
    to: string
}

export interface MailHelperResponse {
    from: string,
    to: string,
    subject: string,
    body: string,
    text: string
}

export interface createEmployeePasswordRequest {
    to: string,
    password: string
}


export interface IUserMail {
    authMail(_options: AuthMailRequest): Promise<void>;
    resetPasswordMail({ to, code }: AuthMailRequest): Promise<void>
    passwordResetConfirmationMail({ to }: TypePasswordResetConfirmationMail): Promise<void>
    createEmployeePassword({ to, password }: createEmployeePasswordRequest): Promise<void>
}
import { AppError } from "./AppError"

export class ErrExpired extends AppError {
    constructor(param: string) {
        super({
            message: `${param} expired or does not exits.`,
            status: 500,
            title: "ErrExpired"
        })
    }
}
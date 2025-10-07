import { AppError } from "./AppError"

export class ErrInternalServerError extends AppError {
    constructor(param: string) {
        super({
            message: param,
            status: 500,
            title: "ErrInternalServerError"
        })
    }
}
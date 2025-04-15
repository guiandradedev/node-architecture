import { Entity } from "@/shared/core/entity";
import { ErrInvalidParam } from "@/shared/errors";

export type TypeUserRoles = 'USER' | 'ADMIN'

type UserProps = {
    name: string,
    email: string,
    password?: string,
    role: TypeUserRoles,
    account_activate_at: Date | null,
    createdAt: Date,
    updatedAt: Date,
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id)
        this.validate(props)
    }

    public static create(props: UserProps, id?: string) {
        const user = new User(props, id);

        return user;
    }

    public validate(props: UserProps) {
        this.validateEmail(props.email)
    }

    public validateEmail(email: string): void {
        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if(!emailFormat) {
            throw new ErrInvalidParam('e-mail')
        }
    }
}
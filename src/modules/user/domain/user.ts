import { Entity } from "@/shared/core/entity";

export type TypeUserRoles = 'USER' | 'ADMIN'

type UserProps = {
    name: string,
    email: string,
    password: string,
    role: TypeUserRoles,
    active: boolean,
    createdAt: Date,
    updatedAt: Date
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id)
    }

    public static create(props: UserProps, id?: string) {
        const user = new User(props, id);

        return user;
    }
}
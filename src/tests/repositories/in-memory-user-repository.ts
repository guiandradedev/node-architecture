import { User } from "@/modules/user/domain";
import { IUserRepository, TypeChangeUserPassword } from "@/modules/user/repositories";

export class InMemoryUserRepository implements IUserRepository {
    public users: User[] = []

    private async findIndexById(id: string): Promise<number> {
        const user = this.users.findIndex(user => user.id === id)

        if(user < 0) return null;

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find(user => user.props.email === email)

        if(!user) return null;

        return User.create({...user.props}, user.id);
    }

    async create(data: User): Promise<void> {
        this.users.push(data)
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.id === id)

        if(!user) return null;

        return User.create({...user.props}, user.id);
    }

    async changeStatus(id: string): Promise<boolean> {
        const data = this.users.find(user=>user.id === id)
        if(!data) return null;
        let status = null;
        if(!data.props.account_activate_at) {
            status = new Date();
        }
        // const status = !data.props.account_activate_at
        data.props.account_activate_at = status
        return !!status; 
    }

    async changePassword({userId, password}: TypeChangeUserPassword): Promise<User> {
        const user = await this.findIndexById(userId)

        if(user === null) return null

        this.users[user].props.password = password

        return User.create({...this.users[user].props}, this.users[user].id)
    }

}
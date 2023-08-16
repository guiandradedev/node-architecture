import { Address, Phone, User } from "@/modules/user/domain";
import { IUserRepository } from "@/modules/user/repositories";

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];
    private phones: Phone[] = [];
    private address: Address[] = [];

    async create(data: User): Promise<void> {
        const { address, phone } = data.props
        this.users.push(data)
        await this.createAddress(address)
        await this.createPhone(phone)
    }
    async createAddress(data: Address | Address[]): Promise<void> {
        if (Array.isArray(data)) {
            data.forEach(address => this.address.push(address))
        } else {
            this.address.push(data)
        }
    }
    async createPhone(data: Phone | Phone[]): Promise<void> {
        if (Array.isArray(data)) {
            data.forEach(phone => this.phones.push(phone))
        } else {
            this.phones.push(data)
        }
    }

    async findByEmail(email: string): Promise<User> {
        const user = this.users.find(user => user.props.email == email)
        if (!user) return null;
        return user;
    }

    async findByCpf(cpf: string): Promise<User> {
        const user = this.users.find(user => user.props.cpf == cpf)
        if (!user) return null;
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.id === id)

        if(!user) return null;

        return User.create({...user.props}, user.id);
    }

    async changeStatus(id: string): Promise<boolean> {
        const data = this.users.find(user=>user.id === id)
        if(!data) return null;
        const status = !data.props.active
        data.props.active = status
        return status; 
    }
}
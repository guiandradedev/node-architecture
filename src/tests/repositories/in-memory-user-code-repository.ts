import { IUserCodeRepository, FindByCode, FindByCodeAndUserId, FindCodeByUserId } from "@/modules/user/repositories";
import { TypesUserCode, UserCode } from "@/modules/user/domain";

export class InMemoryUserCodeRepository implements IUserCodeRepository {
    public codes: UserCode[] = []

    async create(data: UserCode): Promise<void> {
        this.codes.push(data)
    }

    async findByCodeAndUserId({code, userId, type}: FindByCodeAndUserId): Promise<UserCode> {
        const data = this.codes.find((c)=>{
            const isTypeMatch = type ? c.props.type === type : true;
            return c.props.code == code && c.props.userId == userId && isTypeMatch
        })

        if(!data) return null;

        return data;
    }

    async findByCode({code, type}: FindByCode): Promise<UserCode> {
        const data = this.codes.find((c)=>{
            const isTypeMatch = type ? c.props.type === type : true;
            return c.props.code == code && isTypeMatch
        })

        if(!data) return null;

        return data;
    }

    async findByUserId({userId, type}: FindCodeByUserId): Promise<UserCode> {
        const codes = this.codes
        .filter(c => {
            const isTypeMatch = type ? c.props.type === type : true;
            return c.props.userId === userId && isTypeMatch;
        })
        .sort((a, b) => new Date(b.props.createdAt).getTime() - new Date(a.props.createdAt).getTime()); // Ordena por data

        return codes[0] || null; // Retorna o primeiro ou null se não encontrar
    }

    async changeCodeStatus(id: string): Promise<boolean> {
        const data = this.codes.find(c=>c.id==id)
        if(!data) return null;
        const status = !data.props.active
        data.props.active = status
        return status;
    }
    async deleteAllUserCode(id: string, type: TypesUserCode): Promise<void> { 
        this.codes.forEach(code=>{
            if(code.props.userId == id && code.props.type == type) {
                code.props.active = false;
            }
        })
    }
}

import { User } from "@/modules/user/domain";
// import { IPhoneRepository } from "./IPhoneRepository";
// import { IAddressRepository } from "./IAddressRepository";

export interface IUserRepository {
// export interface IUserRepository extends IPhoneRepository, IAddressRepository{
    create(data: User): Promise<void>;
    findByEmail(email: string): Promise<User>
    // findByCpf(cpf: string): Promise<User>
    findById(id: string): Promise<User>
    changeStatus(id: string): Promise<boolean>;
    changePassword({userId, password}: {userId: string, password: string}): Promise<User>;
}
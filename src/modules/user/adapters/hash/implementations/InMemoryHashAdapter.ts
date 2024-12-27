import { IHashAdapter } from "../IHashAdapter";

export class InMemoryHashAdapter implements IHashAdapter {
    private readonly passwordHasheds: string[] = []
    async hash(value: string): Promise<string> {
        this.passwordHasheds.push(value)
        return 'hashed_value'
    }
    async compare(previous: string, original: string): Promise<boolean> {
        return !!this.passwordHasheds.find(password=>password == previous);
    }
}
export interface IHashAdapter {
    hash(value: string): Promise<string>;
    compare(original: string, hashed: string): Promise<boolean>
}
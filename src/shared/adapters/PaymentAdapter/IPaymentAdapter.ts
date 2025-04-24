import { CreatePaymentRequest, CreatePaymentResponse } from "./dtos/create-payment"

export interface Item {
    name: string,
    description: string,
    unit_price: number
}

export interface DatabaseItem extends Item{
    id: string | number,
}

export interface ItemBought {
    item: Item | DatabaseItem,
    quantity: number,
}

export interface IPaymentAdapter {
    create(options: CreatePaymentRequest): Promise<CreatePaymentResponse>
}
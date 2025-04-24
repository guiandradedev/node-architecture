import { CreatePaymentRequest, CreatePaymentResponse } from "./dtos/create-payment"

export interface Item {
    id: string | number,
    name: string,
    description: string,
    unit_price: number
}

export interface ItemBought {
    item: Item,
    quantity: number,
}

export interface IPaymentAdapter {
    create(options: CreatePaymentRequest): Promise<CreatePaymentResponse>
}
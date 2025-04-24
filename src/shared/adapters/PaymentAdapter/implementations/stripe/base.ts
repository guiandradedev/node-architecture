import { CreatePaymentRequest, CreatePaymentResponse } from "../../dtos/create-payment";
import { IPaymentAdapter } from "../../IPaymentAdapter";
import StripeSDK from 'stripe'

export abstract class Stripe implements IPaymentAdapter {
    protected stripe

    protected constructor() {
        if(!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not defined.")
        }
        this.stripe = new StripeSDK(process.env.STRIPE_SECRET_KEY)
    }

    abstract create(options: CreatePaymentRequest): Promise<CreatePaymentResponse>;
}
import { CreatePaymentRequest, CreatePaymentResponse } from "../../dtos/create-payment";
import { IPaymentAdapter, ItemBought } from "../../IPaymentAdapter";
import { Stripe } from "./base";

export class StripeCheckoutPaymentAdapter extends Stripe implements IPaymentAdapter {
    public constructor() {
        super()
    }
    
    private buildLineItems(items: ItemBought[], currency: string) {
        return items.map((item) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.item.name,
                    description: item.item.description,
                },
                unit_amount: Math.round(item.item.unit_price * 100),
            },
            quantity: item.quantity,
        }));
    }
    
    private buildRedirectUrls(redirects: CreatePaymentRequest["redirects"]) {
        const success_url = typeof redirects === "string"
            ? `${redirects}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`
            : `${redirects.success}?session_id={CHECKOUT_SESSION_ID}`;
    
        const cancel_url = typeof redirects === "string"
            ? `${redirects}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`
            : `${redirects.cancel}?session_id={CHECKOUT_SESSION_ID}`;
    
        return { success_url, cancel_url };
    }

    async create(options: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        const { items, currency, redirects, mode } = options
        
        const lineItems = this.buildLineItems(items, currency);
        const { success_url, cancel_url } = this.buildRedirectUrls(redirects);

        const session = await this.stripe.checkout.sessions.create({
            line_items: lineItems,
            shipping_address_collection: {
                allowed_countries: ['BR']
            },
            mode, // or subscription
            success_url,
            cancel_url, // redirect URL if the user cancels the payment
        })

        return {
            url: session.url
        }
    }

}
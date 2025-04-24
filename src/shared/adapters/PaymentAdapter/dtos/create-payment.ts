import { ItemBought } from "../IPaymentAdapter"

/**
 * Pedido de criação de pagamento
 */
export interface CreatePaymentRequest {
    /** Itens comprados no carrinho */
    items: ItemBought[];
    
    /** Moeda usada (ex: BRL, USD) */
    currency: string;
    
    /** URLs de redirecionamento após sucesso/cancelamento */
    redirects: {
        success: string;
        cancel: string;
    } | string;

    /** Modo do checkout: pagamento único ou assinatura */
    mode: "payment" | "subscription";
}


/**
 * Resposta da criação de pagamento
 */
export interface CreatePaymentResponse {
    /**
     * URL para redirecionamento do usuário ao checkout (ex: Stripe Checkout, Mercado Pago, etc).
     * Pode ser usada diretamente em um botão ou redirect.
     */
    url?: string;

    /**
     * `client_secret` gerado pelo Stripe quando se usa `PaymentIntent`.
     * Utilizado principalmente em integrações com frontend customizado (ex: Stripe Elements).
     */
    clientSecret?: string;

    /**
     * ID do pagamento ou sessão gerado pelo provedor de pagamento.
     * Pode ser usado para consultar o status ou associar com pedido interno.
     */
    id?: string;
}

import { CreatePaymentRequest } from "../dtos/create-payment";
import { IPaymentAdapter } from "../IPaymentAdapter";

export class PaymentService {
    constructor(private readonly adapter: IPaymentAdapter) {}
  
    async checkout(data: CreatePaymentRequest) {
      return this.adapter.create(data);
    }
}
import { SupportedCurrency } from '../entities/currency.enum';

export class CreateOrderDto {
  amount: number;
  currency: SupportedCurrency;
  receipt: string;
  notes?: Record<string, string>;
}

export class DiscountPolicy {
  halfYearly: number;
  yearly: number;
}

export class PricingPolicy {
  pricePerMo: number;
  discounts: DiscountPolicy;
}

import { PricingPolicy } from 'src/entities/pricing.entity';

export class CreateTokenPlanDto {
  title: string;
  tokenCountPerMo: number;
  pricing: PricingPolicy;
  summary: string;
}

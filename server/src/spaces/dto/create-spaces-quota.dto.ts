import { PricingPolicy } from 'src/entities/pricing.entity';

export class CreateSpacesQuotaDto {
  title: string;
  summary: string;
  spaceGBs: number;
  pricing: PricingPolicy;
}

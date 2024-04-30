import { PartialType } from '@nestjs/swagger';
import { CreateTokenPlanDto } from './create-token-plan.dto';

export class TokenPlanOutDto extends PartialType(CreateTokenPlanDto) {
  planID: string;
}

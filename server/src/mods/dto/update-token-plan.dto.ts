import { PartialType } from '@nestjs/swagger';
import { CreateTokenPlanDto } from './create-token-plan.dto';

export class UpdateTokenPlanDto extends PartialType(CreateTokenPlanDto) {}

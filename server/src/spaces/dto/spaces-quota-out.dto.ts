import { PartialType } from '@nestjs/swagger';
import { CreateSpacesQuotaDto } from './create-spaces-quota.dto';

export class SpacesQuotaOutDto extends PartialType(CreateSpacesQuotaDto) {
  quotaID: string;
}

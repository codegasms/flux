import { PartialType } from '@nestjs/swagger';
import { CreateSpacesQuotaDto } from './create-spaces-quota.dto';

export class UpdateSpacesQuotaDto extends PartialType(CreateSpacesQuotaDto) {}

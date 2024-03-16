import { PartialType } from '@nestjs/swagger';
import { CreateModDto } from './create-mod.dto';

export class UpdateModDto extends PartialType(CreateModDto) {}

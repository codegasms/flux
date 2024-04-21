import { SpacePath } from './space-path.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class RevokeFileAccessDto extends PartialType(SpacePath) {
  @ApiProperty({ type: 'array', items: { type: 'string' }, default: [] })
  emails: string[];
}

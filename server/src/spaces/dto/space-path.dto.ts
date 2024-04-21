import { ApiProperty, PartialType } from '@nestjs/swagger';

export class SpaceParent {
  @ApiProperty({ type: 'string', required: true })
  spaceParent!: string;
}

export class SpacePath extends PartialType(SpaceParent) {
  @ApiProperty({ type: 'string' })
  fileName: string;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FileVisibility } from '../entities/file-visibility.enum';
import { SpacePath } from './space-path.dto';

export class ShareFileDto extends PartialType(SpacePath) {
  @ApiProperty({
    type: 'string',
    enum: FileVisibility,
    default: FileVisibility.private,
  })
  visibility: string;

  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  viewers?: string[];

  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  editors?: string[];
}

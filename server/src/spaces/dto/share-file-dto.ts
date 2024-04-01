import { ApiProperty } from '@nestjs/swagger';
import { FileVisibility } from '../entities/file-visibility.enum';

export class ShareFileDto {
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

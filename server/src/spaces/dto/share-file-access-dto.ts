import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FileVisibility } from '../entities/file-visibility.enum';
import { SpacePath } from './space-path.dto';
import { FileAccessDto } from './file-access-dto';
import { access } from 'fs';
import { FileAccessType } from '../entities/file-access-type.enum';

export class ShareFileAccessDto extends PartialType(SpacePath) {
  @ApiProperty({
    type: 'string',
    enum: FileVisibility,
    default: FileVisibility.private,
  })
  visibility: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'FileAccessDto' },
    default: [
      { email: 'youremail@codegasms.com', access: FileAccessType.viewer },
    ],
  })
  addOrChangeAccess: FileAccessDto[];
}

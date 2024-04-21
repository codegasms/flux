import { ApiProperty, PartialType } from '@nestjs/swagger';
import { SpaceParent } from './space-path.dto';

export class FileUploadDto extends PartialType(SpaceParent) {
  @ApiProperty({
    type: 'array',
    required: false,
    items: {
      type: 'file',
      format: 'binary',
    },
  })
  files: Array<Express.Multer.File>;
}

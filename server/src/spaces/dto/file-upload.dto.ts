import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
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

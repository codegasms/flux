import { ApiProperty } from '@nestjs/swagger';
import { FileAccessType } from '../entities/file-access-type.enum';

export class FileAccessDto {
  @ApiProperty({ type: 'string', required: true })
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    enum: FileAccessType,
    default: FileAccessType.viewer,
  })
  access: FileAccessType;
}

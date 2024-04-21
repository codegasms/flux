import { PartialType } from '@nestjs/swagger';
import { SpacePath } from './space-path.dto';

export class CopyFileDto extends PartialType(SpacePath) {
  destinationDir: string;
}

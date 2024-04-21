// import { PartialType } from '@nestjs/swagger';
import { SpacePath } from './space-path.dto';

export class MoveFileDto {
  //   destinationDir: string;
  //   destinationFileName: string;

  sourcePath: SpacePath;
  destPath: SpacePath;
}

import { FileObject } from '../spaces.schema';

export class UpdateFileAccessResponseDto {
  missingUsers: string[];
  fileObj: FileObject;
}

export class CreateFileDto {
  spaceParent: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  isDir?: boolean;
  created: Date;
  owner: string;
  lastEdited?: Date;
}

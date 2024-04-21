export interface IFileObjectQuery {
  owner: string;
  spaceParent?: RegExp | string;
  inTrash?: boolean;
  fileName?: string;
}

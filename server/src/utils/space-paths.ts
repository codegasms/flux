import * as lodash from 'lodash';
import { SpacePath } from 'src/spaces/dto/space-path.dto';
import * as path from 'path';

export function splitSpacePath(path: string): SpacePath {
  const sparent = path.split('/');
  const fileName = sparent.pop();
  return {
    spaceParent: sparent.join('/') || '/',
    fileName: fileName,
  };
}

export function trimSlashes(spacePath: string) {
  if (spacePath === '/') return spacePath;
  return lodash.trim(spacePath, '/');
}

export function joinSpacePath(spacePath: SpacePath): string {
  return path.join(spacePath.spaceParent, spacePath.fileName);
}

export function isSpaceRoot(spacePath: SpacePath): boolean {
  if (spacePath.spaceParent === '/' && spacePath.fileName === '') return true;
  return false;
}

import * as lodash from 'lodash';

export function splitSpacePath(spacePath: string): {
  sParent: string;
  fileName: string;
} {
  const sparent = spacePath.split('/');
  const fileName = sparent.pop();
  return {
    sParent: sparent.join('/') || '/',
    fileName: fileName,
  };
}

export function trimSlashes(spacePath: string) {
  if (spacePath === '/') return spacePath;
  return lodash.trim(spacePath, '/');
}

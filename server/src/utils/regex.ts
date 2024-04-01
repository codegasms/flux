export function startsWith(prefix: string) {
  return new RegExp('^' + prefix);
}

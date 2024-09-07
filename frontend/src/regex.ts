export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function isUuid(str: string | null | undefined): str is string {
  return typeof str === 'string' && uuidRegex.test(str);
}

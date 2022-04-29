/**
 * Check if the given object is empty or not.
 *
 * @param {object} obj
 * @returns {bool}
 */
export function isObjectEmpty(obj: Record<string, unknown>): boolean {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

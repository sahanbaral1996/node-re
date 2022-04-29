/**
 * Get min two digits.
 *
 * @example
 * getDateRange(1)
 * => 01
 *
 * @param {Number} number
 * @returns {String}
 */
export const minTwoDigits = (number: number): string => {
  return (number < 10 ? '0' : '') + number;
};

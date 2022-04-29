/**
 * Get arrays from range firstNumber to lastNumber.
 *
 * @example
 * getArrayFromRange(3, 7)
 * =>[3,4,5,6,7]
 *
 * @param {number} firstNumber
 * @param {number} lastNumber
 */
export const getArrayFromRange = (firstNumber: number, lastNumber: number): number[] => {
  if (!firstNumber || !lastNumber) {
    return [];
  }

  return Array.from({ length: firstNumber - lastNumber + 1 }, (_, i) => i + firstNumber);
};

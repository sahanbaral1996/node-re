import pinterpolate from 'pinterpolate';

/**
 * Build supplied string by interpolating properties after delimiter(':') with the given parameters.
 *
 * @example
 * interpolate('/posts/:id', {id: 1})
 * => '/posts/1'
 *
 * @param {string} str
 * @param {object} params
 * @returns {string}
 */
export function interpolate(str: string, params: Record<string, unknown>): string {
  return pinterpolate(str, params);
}

/**
 * Makes first letter of the word capital.
 *
 * @example
 * capitalize('your string')
 * => 'Your String'
 *
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str: string): string {
  return str.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Trim the sentences uptop maxlength.
 * If we are in the middle of a word, trims that word as well.
 *
 * @example
 * trimSentences('your string', 7 )
 * => 'your'
 *
 * @param {string} str
 * @param {number} maxLength
 *
 * @returns {string}
 */
export const trimSentences = (str = '', maxLength: number): string => {
  let trimmedString = '';

  // Trim and re-trim only when necessary (prevent re-trim when string is shorted than maxLength)
  if (str.length > trimmedString.length) {
    // trim the string to the maximum length
    trimmedString = str.substr(0, maxLength);

    // re-trim if we are in the middle of a word and
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
  }

  return trimmedString;
};

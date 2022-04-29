import { StatusCodes } from 'http-status-codes';

/**
 * Override the default Error interface to throw custom error messages.
 *
 * @class Error
 * @extends {APIError}
 */
class APIError extends Error {
  /**
   * Creates an instance of Error.
   *
   * @param {string} message
   * @param {number} code
   * @memberof Error
   */
  message: string;
  code: number;
  constructor(message, code = StatusCodes.INTERNAL_SERVER_ERROR, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }

    this.message = message;
    this.code = code;
  }
}

export default APIError;

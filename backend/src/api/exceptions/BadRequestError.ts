import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import APIError from './Error';

/**
 * @class BadRequestError
 * @extends {APIError}
 */
class BadRequestError extends APIError {
  /**
   * Creates an instance of BadRequestError.
   *
   * @param {string} message
   * @memberof BadRequestError
   */
  constructor(message = ReasonPhrases.BAD_REQUEST) {
    super(message, StatusCodes.BAD_REQUEST);

    this.message = message;
  }
}

export default BadRequestError;

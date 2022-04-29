import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import APIError from './Error';

/**
 * @class ValidationError
 * @extends {APIError}
 */
class ValidationError extends APIError {
  /**
   * Creates an instance of ValidationError.
   *
   * @param {string} message
   * @memberof ValidationError
   */
  errors: any[];
  constructor(errors = [], message = ReasonPhrases.UNPROCESSABLE_ENTITY) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    this.errors = errors;
    this.message = message;
  }
}

export default ValidationError;

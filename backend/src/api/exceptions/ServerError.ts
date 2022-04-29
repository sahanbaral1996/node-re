import { StatusCodes } from 'http-status-codes';

import APIError from './Error';

/**
 * @class ServerError
 * @extends {APIError}
 */
class ServerError extends APIError {
  /**
   * Creates an instance of ServerError.
   *
   * @param {string} message
   * @memberof ServerError
   */
  message: string;
  constructor(message = 'Something went wrong') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);

    this.message = message;
  }
}

export default ServerError;

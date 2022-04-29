import getOr from 'lodash/fp/getOr';

import config from 'config';
import * as toast from './toast';

import * as env from 'constants/env';
import { ErrorObject } from 'types/errorHandler';

const GENERIC_ERROR = 'Oops! Something went wrong';

/**
 * Generic error handler to handle error events.
 *
 * @param {object} event
 * @param {{title, message}} options
 */
export function handleError(event: any, options: ErrorObject = {}): void {
  if (config.env !== env.PRODUCTION) {
    //  Todo
  }

  const message = getOr(GENERIC_ERROR)('response.data.message')(event);

  toast.error({
    title: options.title || 'Error',
    message: options.message || message,
  });
}

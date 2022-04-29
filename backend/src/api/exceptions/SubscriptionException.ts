import camelcaseKeys from 'camelcase-keys';
import APIError from './Error';

class SubscriptionException extends APIError {
  operation: Record<string, string>;
  constructor(message: string, code: number, operation: Record<string, string>) {
    super(message, code);
    // eslint-disable-next-line
    const { http_status_code, error_msg, message: operationMessage, ...rest } = operation;
    this.operation = camelcaseKeys(rest, { deep: true });
  }
}

export default SubscriptionException;

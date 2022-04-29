import APIError from './Error';

class OperationException extends APIError {
  message: string;
  object: string;
  operation: string;
  constructor(messages: string[] = ['Operation Exception'], object: string, operation: string) {
    const combinedMessage = messages.join();
    super(combinedMessage);
    this.message = combinedMessage;
    this.object = object;
    this.operation = operation;
  }
}

export default OperationException;

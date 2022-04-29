import APIError from './Error';

class AlreadyExistsException extends APIError {
  object: string;
  constructor(object: string, message = 'Already Exists') {
    super(message);
    this.object = object;
  }
}

export default AlreadyExistsException;

import APIError from './Error';

class ConstraintViolationException extends APIError {
  object: string;
  constructor(object: string, message = 'Constraint Violation') {
    super(message);
    this.object = object;
  }
}

export default ConstraintViolationException;

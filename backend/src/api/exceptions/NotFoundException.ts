import APIError from './Error';

class NotFoundException extends APIError {
  constructor(message = 'Not Found') {
    super(message);
  }
}

export default NotFoundException;

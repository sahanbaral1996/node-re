import React from 'react';
import { Link } from 'react-router-dom';

import { ELIGIBILITY } from 'constants/routes';
import { ErrorMessageProps } from 'types/common/errorMessage';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, showLink }) => {
  return (
    <div className="error-message">
      {message} {showLink && <Link to={ELIGIBILITY}>here</Link>}
    </div>
  );
};

export default ErrorMessage;

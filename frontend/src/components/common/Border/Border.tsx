import classNames from 'classnames';
import React from 'react';

type BorderProps = {
  isError?: boolean;
};

const Border: React.FC<BorderProps> = ({ children, isError = false }) => {
  const inputWrapperClass = classNames('border__wrap', {
    'input-error': isError,
  });

  return <div className={inputWrapperClass}>{children}</div>;
};

export default Border;

import React, { useState } from 'react';

import classNames from 'classnames';
import { Tooltip } from '@material-ui/core';
import { HelpOutline, VisibilityOutlined, VisibilityOffOutlined } from '@material-ui/icons';

import ErrorMessage from 'components/common/ErrorMessage';

import { ReveaInputProps } from 'types/common/reveaInput';

/**
 * Password Input Common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const PasswordInput: React.FC<ReveaInputProps> = ({
  errorMessage,
  isError,
  name,
  label = '',
  value,
  onChange,
  tooltip,
  type,
  ...rest
}) => {
  const isErrorMessage = errorMessage ? true : false;

  const inputWrapperClass = classNames({
    'revea-input__wrapper': true,
    'input-error': isError || isErrorMessage,
  });

  const inputLabelClass = classNames({
    'revea-input__label': true,
    red: isError || isErrorMessage,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <div className={inputWrapperClass}>
        <label className={inputLabelClass}>
          {label}
          <input
            type={showPassword ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={onChange}
            className="revea-input"
            onBlur={() => setShowPassword(false)}
            {...rest}
          ></input>
          <div
            className="user-registration__eye"
            onClick={e => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {' '}
            {!showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}{' '}
          </div>
        </label>
        {tooltip ? (
          <Tooltip title={tooltip} arrow>
            <HelpOutline className="user-registration__tooltip" />
          </Tooltip>
        ) : null}
      </div>
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
    </>
  );
};

export default PasswordInput;

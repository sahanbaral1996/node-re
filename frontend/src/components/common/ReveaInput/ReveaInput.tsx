import React from 'react';

import classNames from 'classnames';
import { Tooltip } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';

import ErrorMessage from 'components/common/ErrorMessage';

import { ReveaInputProps } from 'types/common/reveaInput';

/**
 * Revea Input Common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const ReveaInput: React.FC<ReveaInputProps> = ({
  errorMessage,
  isError,
  name,
  label = '',
  value,
  onChange,
  tooltip,
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

  return (
    <>
      <div className={inputWrapperClass}>
        <label className={inputLabelClass}>
          {label}
          <input name={name} value={value} onChange={onChange} className="revea-input" {...rest}></input>
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

export default ReveaInput;

import React from 'react';

import classNames from 'classnames';
import SelectDatepicker from 'react-select-datepicker';

import ErrorMessage from 'components/common/ErrorMessage';

import { ReveaDatePickerProps } from 'types/common/reveaDatepicker';

/**
 * Revea DatePicker Common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const ReveaDatePicker: React.FC<ReveaDatePickerProps> = ({ errorMessage, label, value, name, onChange }) => {
  const isError = errorMessage ? true : false;

  const inputWrapperClass = classNames({
    'revea-input__wrapper': true,
    'input-error': isError,
  });

  const inputLabelClass = classNames({
    'react-date-picker__label': true,
    red: isError,
  });

  return (
    <>
      <div className={inputWrapperClass}>
        <label className={inputLabelClass}>{label}</label>
        <SelectDatepicker
          showLabels={false}
          className="date-picker__select"
          value={(value && new Date(value)) || null}
          onDateChange={(val: Date | null) => {
            onChange(name, val);
          }}
          showErrors={false}
        />
      </div>
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
    </>
  );
};

export default ReveaDatePicker;

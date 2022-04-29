import * as React from 'react';

import Border from 'components/common/Border/Border';
import Textarea from 'components/common/Textarea/Textarea';

import { Option, RadioWithDetailProps } from 'types/assessment';
import RadioGroup from 'components/common/RadioGroup/RadioGroup';

const YES_VALUE = 'Yes';
const NO_VALUE = 'No';

const Options: Option[] = [
  { value: YES_VALUE, label: 'Yes' },
  { value: NO_VALUE, label: 'No' },
];

/**
 * Component to render checkboxes with a textarea attached on check.
 *
 * @param {Object} props
 */
const YesNoWithDetail: React.FC<RadioWithDetailProps> = ({
  handleChange,
  values,
  name,
  label,
  placeholder,
  setFieldValue,
}) => {
  const handleHasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === NO_VALUE) {
      setFieldValue(`${name}.explanation`, '');
    }
    handleChange(event);
  };

  return (
    <>
      <RadioGroup options={Options} handleChange={handleHasChange} name={`${name}.has`} value={values.has || ''} />
      {values.has === 'Yes' ? (
        <Border>
          <Textarea
            label={label || ''}
            placeholder={placeholder}
            name={`${name}.explanation`}
            onChange={handleChange}
            value={values.explanation}
          />
        </Border>
      ) : null}
    </>
  );
};

export default YesNoWithDetail;

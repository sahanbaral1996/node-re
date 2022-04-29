import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { CheckboxGroupProps } from 'types/assessment';

/**
 * Component to render a group of checkboxes for a common field.
 *
 * @param {Object} props
 */
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, name, handleChange, values }) => {
  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event, name);
  };

  const isChecked = (value: string) => {
    return values.includes(value);
  };

  return (
    <FormGroup>
      {options.map(option => (
        <FormControlLabel
          className={option.labelClassName}
          control={
            <Checkbox checked={isChecked(option.value)} name={name} onChange={onHandleChange} value={option.value} />
          }
          label={option.label}
          key={option.value}
        />
      ))}
    </FormGroup>
  );
};

export default CheckboxGroup;

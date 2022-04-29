import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import MaterialRadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { RadioGroupProps } from 'types/assessment';

/**
 * Component to render a group of checkboxes for a common field.
 *
 * @param {Object} props
 */
const RadioGroup: React.FC<RadioGroupProps> = ({ handleChange, value, options, name }) => {
  React.useEffect(() => {
    /* eslint-disable no-console */
    console.log('rendered', value);
  }, []);

  return (
    <MaterialRadioGroup aria-label={name} name={name} value={value} onChange={handleChange}>
      {options.map(option => (
        <FormControlLabel
          value={option.value}
          control={<Radio />}
          label={option.label}
          key={`${name}-${option.value}`}
        />
      ))}
    </MaterialRadioGroup>
  );
};

export default RadioGroup;

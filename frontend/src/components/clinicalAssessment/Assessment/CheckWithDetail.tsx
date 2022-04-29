import * as React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Border from 'components/common/Border/Border';
import Textarea from 'components/common/Textarea/Textarea';

import { en } from 'constants/lang';
import { CheckWithDetailProps } from 'types/assessment';

/**
 * Component to render checkboxes with a textarea attached on check.
 *
 * @param {Object} props
 */
const CheckWithDetail: React.FC<CheckWithDetailProps> = ({ options, values, handleChange, name }) => {
  const isChecked = (value: string, key?: string) => {
    if (!key) {
      return false;
    }

    return values[key][0] === value;
  };

  /**
   *
   * @param index Index value of an option from the list of options.
   * @param key Key of the associated checkbox.
   */

  const showTextArea = (index: number, key?: string) => {
    if (!key) {
      return false;
    }

    return values[key] && values[key].length && index !== options.length - 1;
  };

  const getTextareaValue = (key?: string) => {
    if (!key) {
      return '';
    }

    return values[key];
  };

  return (
    <FormGroup>
      {options.map((option, index) => {
        return (
          <React.Fragment key={option.value}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked(option.value, option.field)}
                  onChange={e => handleChange(e, name, option.field)}
                  name={`${name}.${option.field}`}
                  value={option.value}
                />
              }
              className={option.labelClassName}
              classes={{
                label: 'd-flex flex-column',
              }}
              label={option.label}
              key={option.value}
            />
            {showTextArea(index, option.field) ? (
              <Border>
                <Textarea
                  label={en.checkWithDetail.LABEL}
                  placeholder={en.checkWithDetail.PLACEHOLDER}
                  name={`${name}.${option.field}Description`}
                  onChange={handleChange}
                  value={getTextareaValue(`${option.field}Description`)}
                />
              </Border>
            ) : null}
          </React.Fragment>
        );
      })}
    </FormGroup>
  );
};

export default CheckWithDetail;

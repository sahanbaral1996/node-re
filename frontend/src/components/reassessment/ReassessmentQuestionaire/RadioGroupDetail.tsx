import * as React from 'react';

import Border from 'components/common/Border/Border';
import Textarea from 'components/common/Textarea/Textarea';
import RadioGroup from 'components/common/RadioGroup/RadioGroup';

import { RadioGroupWithDetailProps } from 'types/reassessment';

/**
 * Component to render checkboxes with a textarea attached on check.
 *
 * @param {Object} props
 */
const RadioGroupDetail: React.FC<RadioGroupWithDetailProps> = ({ textArea, item, options, handleChange, name }) => {
  /**
   *
   * @param index Index value of an option from the list of options.
   * @param key Key of the associated checkbox.
   */

  const showTextArea = item.value === 'Yes' ? true : false;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event, name, event.target.value);
  };

  return (
    <>
      <RadioGroup options={options} name={`${name}.value`} value={item.value} handleChange={onChange} />

      {showTextArea ? (
        <>
          <div className="questionnaire__title">{textArea.question}</div>
          <Border>
            <Textarea
              label={textArea.label}
              placeholder={textArea.description}
              name={`${name}.description`}
              value={item.description}
              onChange={handleChange}
            />
          </Border>
        </>
      ) : null}
    </>
  );
};

export default RadioGroupDetail;

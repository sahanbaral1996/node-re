import * as React from 'react';
import { en } from 'constants/lang';
import Border from 'components/common/Border/Border';
import Textarea from 'components/common/Textarea/Textarea';
import RadioGroup from 'components/common/RadioGroup/RadioGroup';
import { RadioWithOtherExplanationProps } from 'types/assessment';

const OTHER_VALUE = 'Other';

const RadioWithOtherExplanation: React.FC<RadioWithOtherExplanationProps> = ({
  radioName,
  textBoxName,
  handleChange,
  options,
  gender,
  otherExplanation,
}) => {
  return (
    <>
      <RadioGroup
        name={radioName}
        options={options}
        value={gender}
        handleChange={e => handleChange(e, gender, textBoxName)}
      />

      {gender === OTHER_VALUE && (
        <Border>
          <Textarea
            label={en.genderAssessment.textBox.LABEL}
            placeholder={en.genderAssessment.textBox.PLACEHOLDER}
            name={textBoxName}
            value={otherExplanation}
            onChange={e => handleChange(e, otherExplanation, radioName)}
          />
        </Border>
      )}
    </>
  );
};

export default RadioWithOtherExplanation;

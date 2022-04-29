import * as React from 'react';

import Textarea from 'components/common/Textarea';
import Border from 'components/common/Border/Border';

import RadioGroup from 'components/common/RadioGroup/RadioGroup';
import { Option, AllergyProps } from 'types/assessment';
import { en } from 'constants/lang';

const YES_VALUE = 'Yes';
const NO_VALUE = 'No';

const Options: Option[] = [
  { value: YES_VALUE, label: 'Yes' },
  { value: NO_VALUE, label: 'No' },
];

const Allergy: React.FC<AllergyProps> = ({
  yesMedication,
  yesMushroom,
  onChange,
  name,
  explanation,
  setFieldValue,
}) => {
  const handleHasMedicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === NO_VALUE) {
      setFieldValue(`${name}.medications.explanation`, '');
    }
    onChange(event);
  };

  return (
    <>
      <div>
        <div>
          <div className="questionnaire__title">{en.allergyQuestion.TITLE}</div>
          <div className="questionnaire__description">{en.allergyQuestion.MEDICATIONS}</div>
          <RadioGroup
            options={Options}
            name={`${name}.medications.has`}
            value={yesMedication || ''}
            handleChange={handleHasMedicationChange}
          />
          {yesMedication === YES_VALUE && (
            <Border>
              <Textarea
                label={en.allergyQuestion.MEDICATION_LABEL}
                placeholder={en.allergyQuestion.MEDICATIONS_PLACEHOLDER}
                name={`${name}.medications.explanation`}
                value={explanation}
                onChange={onChange}
              />
            </Border>
          )}
        </div>
        <div className="mg-top-20">
          <div className="questionnaire__description"> {en.allergyQuestion.MUSHROOM} </div>
          <RadioGroup
            options={Options}
            name={`${name}.mushrooms.has`}
            value={yesMushroom || ''}
            handleChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default Allergy;

import * as React from 'react';

import RadioGroup from '../../common/RadioGroup/RadioGroup';
import Border from 'components/common/Border/Border';
import Textarea from 'components/common/Textarea/Textarea';

import { Option, MenstrualPeriodsProps } from 'types/assessment';
import { en } from 'constants/lang';
import fi from 'date-fns/esm/locale/fi/index.js';

const YES_VALUE = 'Yes';
const NO_VALUE = 'No';
const OTHER_VALUE = 'Other';

const occurOptions: Option[] = [
  { value: YES_VALUE, label: 'Yes' },
  { value: NO_VALUE, label: 'No' },
];

const whyNotOptions: Option[] = [
  { value: 'I had a hysterectomy', label: 'I had a hysterectomy' },
  { value: 'I am post-menopausal', label: 'I am post-menopausal' },
  { value: 'I have an IUD', label: 'I have an IUD' },
  { value: 'I am on Depo-provera', label: 'I am on Depo-provera' },
  { value: OTHER_VALUE, label: 'Other' },
];

/**
 * Component to render questions related to menstrual period.
 *
 * @param {Object} props
 */
const MenstrualPeriods: React.FC<MenstrualPeriodsProps> = ({
  doesOccur,
  whyNot,
  explanation,
  handleChange,
  setFieldValue,
}) => {
  const handleOccurrenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === YES_VALUE) {
      setFieldValue('menstrualPeriod.whyNot', '');
      setFieldValue('menstrualPeriod.explanation', '');
    }
    handleChange(event);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value !== OTHER_VALUE) {
      setFieldValue('menstrualPeriod.explanation', '');
    }
    handleChange(event);
  };

  return (
    <>
      <RadioGroup
        options={occurOptions}
        name="menstrualPeriod.doesOccur"
        value={doesOccur || ''}
        handleChange={handleOccurrenceChange}
      />

      {doesOccur === NO_VALUE && (
        <div className="mt-4x">
          <div className="questionnaire__description">{en.menstrualPeriod.NO_LABEL}</div>
          <RadioGroup
            options={whyNotOptions}
            name="menstrualPeriod.whyNot"
            value={whyNot}
            handleChange={handleReasonChange}
          />
          {whyNot === OTHER_VALUE && (
            <Border>
              <Textarea
                label={en.menstrualPeriod.LABEL}
                placeholder={en.menstrualPeriod.PLACEHOLDER}
                name="menstrualPeriod.explanation"
                value={explanation}
                onChange={handleChange}
              />
            </Border>
          )}
        </div>
      )}
    </>
  );
};

export default MenstrualPeriods;

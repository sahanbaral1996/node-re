import * as React from 'react';

import RadioGroup from 'components/common/RadioGroup/RadioGroup';

import { SkinTypeProps } from 'types/assessment';

import { en } from 'constants/lang';

import { SENSITIVITY_OPTIONS, SKIN_DRYNESS_OPTIONS } from 'constants/assessment';

const SkinType: React.FC<SkinTypeProps> = ({ name, values, handleSkinTypeChange, handleSensitivityChange }) => {
  return (
    <>
      <div>
        <div className="questionnaire__description">{en.skinType.TYPE}</div>
        <RadioGroup
          name={`${name}.type`}
          options={SKIN_DRYNESS_OPTIONS}
          value={values.type}
          handleChange={handleSkinTypeChange}
        />
      </div>
      <div className="mg-top-20">
        <div className="questionnaire__description">{en.skinType.PRODUCTS}</div>
        <RadioGroup
          name={`${name}.sensitivity`}
          options={SENSITIVITY_OPTIONS}
          value={values.sensitivity}
          handleChange={handleSensitivityChange}
        />
      </div>
    </>
  );
};

export default SkinType;

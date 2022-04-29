import * as React from 'react';
import RadioGroup from '../../common/RadioGroup/RadioGroup';
import Border from 'components/common/Border/Border';
import Textarea from 'components/common/Textarea/Textarea';

import { Option, TopicalRetinoidProps } from 'types/assessment';
import { en } from 'constants/lang';

const YES_VALUE = 'Yes';
const NO_VALUE = 'No';

const options: Option[] = [
  { value: YES_VALUE, label: 'Yes' },
  { value: NO_VALUE, label: 'No' },
];

/**
 * Component to render questions related to topical retinoid.
 *
 * @param {Object} props
 */
const TopicalRetinoid: React.FC<TopicalRetinoidProps> = ({
  hasUsed,
  specificProduct,
  stillUsing,
  skinToleration,
  dosage,
  handleChange,
  setFieldValue,
}) => {
  const handleHasUsedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === NO_VALUE) {
      setFieldValue('topicalRetinoid.stillUsing', '');
      setFieldValue('topicalRetinoid.specificProduct', '');
      setFieldValue('topicalRetinoid.skinToleration', '');
      setFieldValue('topicalRetinoid.dosage', '');
    }
    handleChange(event);
  };

  return (
    <>
      <RadioGroup
        options={options}
        name="topicalRetinoid.hasUsed"
        value={hasUsed || ''}
        handleChange={handleHasUsedChange}
      />
      {hasUsed === YES_VALUE ? (
        <div className="mt-4x">
          <div className="topical-retinoid__text">
            <Border>
              <Textarea
                label={en.topicalRetinoid.specificProduct.LABEL}
                placeholder={en.topicalRetinoid.specificProduct.PLACEHOLDER}
                value={specificProduct}
                name="topicalRetinoid.specificProduct"
                onChange={handleChange}
              />
            </Border>
          </div>
          <div className="topical-retinoid__text">
            <Border>
              <Textarea
                label={en.topicalRetinoid.dosage.LABEL}
                placeholder={en.topicalRetinoid.dosage.PLACEHOLDER}
                value={dosage}
                name="topicalRetinoid.dosage"
                onChange={handleChange}
              />
            </Border>
          </div>
          <div className="topical-retinoid__text">
            <Border>
              <Textarea
                label={en.topicalRetinoid.skinToleration.LABEL}
                placeholder={en.topicalRetinoid.skinToleration.PLACEHOLDER}
                value={skinToleration}
                name="topicalRetinoid.skinToleration"
                onChange={handleChange}
              />
            </Border>
          </div>
          <div className="mt-4x">
            <div className="questionnaire__description">{en.topicalRetinoid.stillUsing.TITLE}</div>
            <RadioGroup
              options={options}
              name="topicalRetinoid.stillUsing"
              value={stillUsing}
              handleChange={handleChange}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TopicalRetinoid;

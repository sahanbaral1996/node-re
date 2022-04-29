import * as React from 'react';

import Textarea from 'components/common/Textarea';
import Border from 'components/common/Border/Border';
import ReveaScale from 'components/common/ReveaScale';

import { PeelingScaleProps } from 'types/reassessment';

/**
 * Component to render scalne and text area for peeling and irritation.
 *
 * @param {Object} props
 */
const PeelingScale: React.FC<PeelingScaleProps> = ({ value, onPeelingScaleChange, handleChange, name }) => {
  return (
    <>
      <div>
        <div>
          <div className="questionnaire__title">
            On a scale of 1 - 10, how uncomfortable is the redness, irritation or peeling?
          </div>
          <ReveaScale
            minLabel={'Mild discomfort'}
            currentValue={parseInt(value.rating)}
            maxLabel={'Unbearable discomfort'}
            scale={10}
            handleChange={onPeelingScaleChange}
          />
        </div>
        <div className="mg-top-20">
          <div className="questionnaire__title"> Please provide details on what you are experiencing</div>
          <Border>
            <Textarea
              name={`${name}.description`}
              value={value.description}
              label=""
              placeholder="e.g. Skin around the corners of nose is peeling"
              onChange={handleChange}
            />
          </Border>
        </div>
      </div>
    </>
  );
};

export default PeelingScale;

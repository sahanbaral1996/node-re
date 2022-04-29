import * as React from 'react';

import Textarea from 'components/common/Textarea';
import Border from 'components/common/Border/Border';
import { CurrentConditionProps } from 'types/reassessment';

const CurrentCondition: React.FC<CurrentConditionProps> = ({ value, handleChange, name }) => {
  return (
    <>
      <div>
        <div className="mg-top-20">
          <div className="questionnaire__title">
            Thanks for sharing that with us. Please ellaborate on your skin’s current condition.
          </div>
          <Border>
            <Textarea name={name} value={value} label="" placeholder="eg. Skin irriation..." onChange={handleChange} />
          </Border>
        </div>
      </div>
    </>
  );
};

export default CurrentCondition;

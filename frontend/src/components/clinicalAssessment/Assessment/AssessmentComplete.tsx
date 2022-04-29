import * as React from 'react';

import { en } from 'constants/lang';
import Loader from 'components/common/Loader/Loader';

interface IAssessmentComplete {
  loader?: boolean;
}

const AssessmentComplete: React.FC<IAssessmentComplete> = ({ loader }) => {
  return (
    <div className="assessment-complete__container">
      <div className="assessment__content assessment-wrapper container">
        <div className="assessment-complete container">
          <div className="col-8-lg mx-auto text-center image-div"></div>
          <h3 className="assessment-complete__title mt-5x">{en.assessmentComplete.TITLE}</h3>
          <p className="assessment-complete__description">{en.assessmentComplete.TEXT}</p>
          <Loader />
        </div>
      </div>
    </div>
  );
};

export default AssessmentComplete;

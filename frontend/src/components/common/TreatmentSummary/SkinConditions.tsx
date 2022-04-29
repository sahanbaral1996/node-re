import * as React from 'react';
import classNames from 'classnames';

import { en } from 'constants/lang';
import { getIssueValue } from 'utils/skinConditions';
import Card from 'components/home/TreatmentSummary/Card';
import { ISkinCoditionProps } from 'types/common/skinConditions';
import { CardSkinConditionSkeleton } from '../contentLoaders/OrderReviewLoaders';

const SkinConditions: React.FunctionComponent<ISkinCoditionProps> = ({
  isLoading,
  skinConditions,
  isFeedbackSend,
  setShowConditionDetails,
  goals = [],
}) => {
  const getSkinConditionImage = (Image: any) => {
    return <Image width="24" height="24" fill="#B91F56" />;
  };

  return (
    <Card title={en.treatmentSummary.title}>
      {isLoading ? (
        <CardSkinConditionSkeleton className="skin-condition-skeleton" />
      ) : (
        <div className="skin-condition__wrapper row">
          <div className="card__media custom-scrollbar col-5-xl">
            {skinConditions.map((issue, idx) => (
              <div className="media d-flex align-items-center mb-5x" key={idx}>
                <div className="media__image mr-2x">{getSkinConditionImage(getIssueValue(issue)('img'))}</div>
                <div className="media__content">
                  <h6
                    className={classNames('media__title', {
                      'cursor-pointer': !isFeedbackSend,
                    })}
                    onClick={setShowConditionDetails}
                  >
                    {getIssueValue(issue)('label')}
                  </h6>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6x col-7-xl">
            <p className="mb-4x goal__header font-weight-bold">{en.yourPlan.GOALS_TITLE}</p>
            <ol className="pl-6x">
              {goals.map((goal, index) => (
                <li key={index} className="mb-3x">
                  {goal}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SkinConditions;

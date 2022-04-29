import * as React from 'react';

import Button from 'components/common/button';
import ButtonContentLoader from 'components/common/contentLoaders/ButtonContentLoader';

import { TreatmentSummary } from 'types/personalizedSolution';

import { fetchByDetails } from 'services/personalizedSolution';
import { handleError } from 'utils/errorHandler';
import { getIssueValue } from 'utils/skinConditions';
import { en } from 'constants/lang';
import { differenceInDays, startOfDay } from 'date-fns';
import SkinConditionModal from './SkinConditionModal';
import HeaderLine from 'components/common/HeaderLine';
import { REASSESSMENT } from 'constants/routes';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { HomeRouterContext } from '../Router';
import { UserStatus } from 'types/profile';

const BASE_TREATMENT_SUMMARY = {
  assmtDaysUntilDue: 0,
  assmtLastCompleted: '',
  assmtNextDueDate: '',
  id: '',
  name: '',
  skinConditions: [],
  assmtActive: false,
};

/**
 * Function to get difference between two date in days.
 *
 * @param {String} date
 */
const daysUntilDue = (date: string) => {
  const today = startOfDay(new Date());
  const dateToCompare = startOfDay(new Date(date));
  const diff = differenceInDays(dateToCompare, today);

  return diff;
};

const PersonalizedSolution: React.FunctionComponent<{ disableSkinDetails?: boolean }> = ({ disableSkinDetails }) => {
  const [treatmentSummary, setTreatmentSummary] = React.useState<TreatmentSummary>(BASE_TREATMENT_SUMMARY);
  const [isSummaryLoading, setIsSummaryLoading] = React.useState(true);
  const [showConditionDetails, setShowConditionDetails] = React.useState(false);

  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  React.useEffect(() => {
    const fetchTreatmentSummary = async () => {
      try {
        setIsSummaryLoading(true);
        const res = await fetchByDetails();

        setTreatmentSummary(res.data.data);
      } catch (err) {
        handleError(err);
      } finally {
        setIsSummaryLoading(false);
      }
    };

    fetchTreatmentSummary();
  }, [setTreatmentSummary]);

  /**
   * Function to get reassessment block.
   *
   * @param {String} date
   * @param {Boolean} isActive
   * @param {string} status
   */
  const getReassessmentBlock = (date: string, isActive: boolean, status: string) => {
    if (!isActive && !date) {
      return <p className="mt-1x">{en.personalizedSolution.REASSESSMENT_DATE_UNAVAILABLE}</p>;
    }

    const days = daysUntilDue(date);

    if (!Number.isInteger(days) || days === null) {
      return '';
    }

    const daysPostFix = days > 1 ? 'days' : 'day';
    const formattedDays = days > 0 ? `${days} ${daysPostFix}` : en.personalizedSolution.NOW;

    return !treatmentSummary.assmtActive || !(status === UserStatus.Active) ? (
      <React.Fragment>
        <p>{en.personalizedSolution.MESSAGE}</p>
        <p className="mt-4x">{en.personalizedSolution.NEXT_ASSESSMENT_TIME}</p>
        <span className="personalized-solution__days">{formattedDays}</span>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <p className="mt-1x">{en.personalizedSolution.MESSAGE}</p>
        <p className="mt-4x">
          {en.personalizedSolution.NEXT_ASSESSMENT_TIME}:{' '}
          <span className="mt-6x personalized-solution__days">{formattedDays}</span>
        </p>
        <Link to={REASSESSMENT} className="mt-6x">
          <Button color="quaternary" className="reassessment-btn">
            {en.personalizedSolution.REASSESSMENT_DUE}
          </Button>
        </Link>
      </React.Fragment>
    );
  };

  const showSkinConditionDetails = (): void => {
    setShowConditionDetails(true);
  };

  const getSkinConditionImage = (Image: any) => {
    return <Image width="20" height="20" fill="white" className="mr-2x" />;
  };

  return (
    <React.Fragment>
      <div className="App dashboard__hero py-6x">
        <div className="container">
          <div className="d-flex justify-content-between reassessment-block__container">
            <div>
              <h1 className="my-0x">{en.personalizedSolution.TITLE}</h1>
              <div className="d-flex flex-wrap mt-4x skin-conditions">
                {isSummaryLoading ? (
                  <ButtonContentLoader />
                ) : (
                  treatmentSummary.skinConditions.map((issue, idx) => (
                    <Button
                      color="transparent"
                      className={classNames('p-0x skin-condition__item', {
                        'skin-condition--no-underline': disableSkinDetails,
                      })}
                      key={idx}
                      onClick={() => !disableSkinDetails && showSkinConditionDetails()}
                    >
                      <span className="d-flex">
                        {getSkinConditionImage(getIssueValue(issue)('img'))}
                        <span>{getIssueValue(issue)('label')}</span>
                      </span>
                    </Button>
                  ))
                )}
              </div>
            </div>
            <div className="reassessment-block personalized-solution__border--left d-flex flex-column justify-content-center align-items-start pt-8x pt-4x-md pb-5x pl-0x pl-9x-md">
              <p className="personalized-solution__info mb-2x">{en.personalizedSolution.STAY_IN_TOUCH}</p>
              {getReassessmentBlock(
                treatmentSummary.assmtNextDueDate,
                treatmentSummary.assmtActive,
                userProfile?.status || ''
              )}
            </div>
          </div>
        </div>
      </div>
      {showConditionDetails ? <SkinConditionModal onClose={() => setShowConditionDetails(false)} /> : null}
      <HeaderLine />
    </React.Fragment>
  );
};

export default PersonalizedSolution;

import * as React from 'react';

import { fetchPlan } from 'services/plan';

import Modal from 'components/common/Modal';
import Button from 'components/common/button/Buttton';
import { HomeRouterContext } from 'components/home/Router';

import PlanItem, { PlanItemLoader } from './PlanItem';
import OrderFeedback from '../OrderFeedback';

import { IPlan, PlanStatus } from 'types/plan';

import { en } from 'constants/lang';
import { isAfterDate, isBetweenDates } from 'utils/date';

const getPlanStatus = (plan: IPlan, index: number): PlanStatus => {
  const currentDate = new Date();
  const planStartDate = new Date(plan.startDate);
  const planEndDate = new Date(plan.endDate);

  if (isAfterDate(planStartDate, currentDate) && index === 0) {
    return PlanStatus.ACTIVE;
  } else if (isBetweenDates(planStartDate, planEndDate, currentDate)) {
    return PlanStatus.ACTIVE;
  } else if (isAfterDate(planStartDate, currentDate)) {
    return PlanStatus.UPCOMMING;
  }

  return PlanStatus.COMPLETED;
};

const Plan: React.FC = () => {
  const { state: userState } = React.useContext(HomeRouterContext);

  const [{ plans, isLoading }, setPlans] = React.useState<{
    isLoading: boolean;
    plans: IPlan[];
  }>({
    isLoading: true,
    plans: [],
  });

  const [planDetails, setPlanDetails] = React.useState<React.ReactNode | null>(null);

  const [showOrderFeedBack, setShowOrderFeedback] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (userState) {
        const {
          data: { plans },
        } = (await fetchPlan(userState.id)).data;

        setPlans(prevState => ({
          ...prevState,
          isLoading: false,
          plans,
        }));
      }
    })();
  }, [userState]);

  const handleShowDetails = (details: React.ReactNode | null) => {
    setPlanDetails(details);
  };

  const toggleOrderFeedBack = () => {
    setShowOrderFeedback(prevState => !prevState);
  };

  return (
    <>
      <div className="user-plan-section container">
        <div className="user-plan-header my-10x mt-0x-sm">
          <div className="d-flex flex-wrap justify-content-between-sm font-weight-bold">
            <h2 className="mb-4x mb-0x-sm mt-11x-md">{en.yourPlan.TITLE}</h2>
            <div className="challenge-wrapper mt-6x-md">
              <p className="challenge-title mb-2x">{en.challengesSummary.SUBTITLE}</p>
              <p className="challenge-body mb-5x">{en.challengesSummary.BODY}</p>
              <Button onClick={toggleOrderFeedBack} color="quaternary" className="challenge-btn">
                <span>{en.challengesSummary.TALK_TO_US}</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="user-plan-main">
          {isLoading ? (
            <PlanItemLoader />
          ) : (
            plans.map((plan, index) => (
              <PlanItem status={getPlanStatus(plan, index)} key={index} plan={plan} onShowDetails={handleShowDetails} />
            ))
          )}
        </div>
      </div>
      {planDetails ? (
        <Modal className="modal__wrapper--lg" isClose={() => handleShowDetails(null)}>
          {planDetails}
        </Modal>
      ) : null}
      {showOrderFeedBack ? <OrderFeedback onClose={toggleOrderFeedBack} /> : null}
    </>
  );
};

export default Plan;

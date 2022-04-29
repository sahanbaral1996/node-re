import * as React from 'react';
import { useHistory } from 'react-router-dom';

import Assessment from './Assessment';

import * as routes from 'constants/routes';
import { en } from 'constants/lang';
import { INITIAL_STEP, LOCAL_STORAGE_ASSESSMENT } from 'constants/assessment';

import { UserStatus } from 'types/profile';
import { refreshCurrentSession } from 'services/auth';
import * as FS from 'services/fullstory';
import { createUserClinicalAssessment, createInPersonAssessment } from 'services/assessment';

import { handleError } from 'utils/errorHandler';
import { clearValue, readValue } from 'utils/localStorage';
import { HomeRouterContext } from 'components/home/Router';

import { toJson as formatDataToJson } from 'usecase/assessment';
import { AssessmentFormValues, assessmentInitialFormValue } from './Assessment/assessment.config';

import { AssessmentFlow, AssessmentLocalStorage } from 'types/assessment';
import { IOnboardChildProps, OnboardSteps } from 'types/onboard';

import { PIXEL } from 'constants/lang/facebook';
import { fbPixelApiConversion } from 'services/analytics';
import { fetchProfile } from 'services/profile';
/**
 * Clinical assessment main component.
 */
const ClinicalAssessment: React.FC<IOnboardChildProps> = ({ onContinue }) => {
  const { state: userProfile } = React.useContext(HomeRouterContext);
  const initialFormValue: AssessmentLocalStorage | null = readValue(LOCAL_STORAGE_ASSESSMENT);

  const [showProgress, setShowProgress] = React.useState(true);

  const [assessmentValues, setAssessmentValues] = React.useState<AssessmentFormValues>(
    initialFormValue?.formValue || assessmentInitialFormValue
  );

  const [currentFLow, setCurrentFlow] = React.useState<AssessmentFlow>(AssessmentFlow.QUESTIONS);

  const history = useHistory();

  /**
   * Invoked on assessment complete.
   *
   * @param {Object} values
   *
   * @returns {React.Component}
   */
  const onAssessmentSubmit = async (values: AssessmentFormValues) => {
    FS.customEvent(en.fullStoryCusEvent.ACCOUNT_CREATED);
    setShowProgress(false);
    const assessment = formatDataToJson({ ...values });

    try {
      let response;

      if (userProfile && userProfile.status === UserStatus.InPerson) {
        response = await createInPersonAssessment(assessment, userProfile.id);
      } else {
        response = await createUserClinicalAssessment(assessment);
      }

      if (response.status === 200) {
        await refreshCurrentSession();
        const {
          data: { data: profile },
        } = await fetchProfile();

        clearValue(LOCAL_STORAGE_ASSESSMENT);
        if (userProfile && userProfile.status === UserStatus.InPerson) {
          onContinue(OnboardSteps.ImageUpload, profile);
        } else {
          onContinue(OnboardSteps.Billing, profile);
        }
      }
    } catch (err) {
      handleError(err);
      setCurrentFlow(AssessmentFlow.QUESTIONS);
    }
  };

  const onAssessmentBack = (formValues: AssessmentFormValues) => {
    setAssessmentValues(formValues);
    clearValue(LOCAL_STORAGE_ASSESSMENT);
    history.push(routes.INITIAL);
  };

  React.useEffect(() => {
    FS.customEvent(en.fullStoryCusEvent.ASSESSMENT_STARTED);
    fbPixelApiConversion(PIXEL.CUSTOMIZE_PRODUCT);
  }, []);

  return (
    <>
      <Assessment
        initialFormValue={assessmentValues}
        onSubmit={onAssessmentSubmit}
        onBack={onAssessmentBack}
        initialStep={initialFormValue?.step || INITIAL_STEP}
        showProgress={showProgress}
        currentFlow={currentFLow}
        setCurrentFlow={setCurrentFlow}
      />
    </>
  );
};

export default ClinicalAssessment;

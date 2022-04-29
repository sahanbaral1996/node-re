import * as React from 'react';

import Button from 'components/common/button/Buttton';
import WarningDialog from 'components/common/WarningDialog';

import { en } from 'constants/lang';
import * as routes from 'constants/routes';
import { QuestionnaireProps } from 'types/questionnaire';
import { useHistory } from 'react-router-dom';
import { warningIcon } from 'assets/images';
import Border from '../Border/Border';
import Textarea from '../Textarea/Textarea';
import { QUESTION_SET, QUESTION_STEP } from 'components/clinicalAssessment/Assessment/assessment.config';
import * as GTM from 'services/tagManager';

/**
 * Component to render questions, handle navigation and validations in assessment form.
 *
 * @param {Object} props
 */
const Questionnaire: React.FC<QuestionnaireProps> = ({
  question,
  description = '',
  children,
  skipLink,
  onBackClick,
  onContinueClick,
  skipPrev,
  skipNext,
  currentState,
  currentStep,
  validation,
  showBackButton = true,
  name,
}) => {
  const [error, setError] = React.useState<any>(null);
  const [isPregnantWarningDialogOpen, setIsPregnantWarningDialogOpen] = React.useState(false);
  const [isContinueClicked, setIsContinueClicked] = React.useState<boolean>(false);

  React.useEffect(() => {
    setError(null);
    setIsContinueClicked(false);
  }, [question]);

  React.useEffect(() => {
    (async () => {
      if (validation && isContinueClicked) {
        try {
          await validation(currentState[name]);
          setError(null);
        } catch (err) {
          setError(err);
        }
      }
    })();
  }, [currentState, isContinueClicked, validation, name]);

  const handleSkipLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    onContinueClick();
  };

  const handleContinueClick = async () => {
    if (currentState.prescriptionDuringPregnancy && currentState.prescriptionDuringPregnancy === 'Pregnant') {
      setIsPregnantWarningDialogOpen(true);

      return;
    }
    if (validation) {
      try {
        await validation(currentState[name]);
        if (QUESTION_STEP.size === currentStep + 1) {
          GTM.customEvent(en.tagManagerCusEvent.ASSESSMENT_COMPLETED);
        }
        setError(null);
        setIsContinueClicked(false);
      } catch (err) {
        setError(err);
        setIsContinueClicked(true);

        return;
      }
    }

    if (!skipNext) {
      onContinueClick();

      return;
    }

    const newStep = skipNext(currentState, currentStep);

    onContinueClick(newStep);
  };

  const handleBackClick = () => {
    if (currentState.prescriptionDuringPregnancy === 'Pregnant') {
      currentState.prescriptionDuringPregnancy = null;
    }

    if (!skipPrev) {
      onBackClick();

      return;
    }

    const newStep = skipPrev(currentState, currentStep);

    onBackClick(newStep);
  };

  const handleSubmit = () => {
    setIsPregnantWarningDialogOpen(false);
    window.open(routes.REVEA_LANDING, '_self');
  };

  const handleBack = () => {
    setIsPregnantWarningDialogOpen(false);
  };

  const warningBody = () => (
    <React.Fragment>
      <div className="warning-dialog__body px-20x">
        <h3 className="warning-pregnant-dialog_title">{en.menstrualPeriod.PREGNANT_WARNING.TITLE}</h3>
        <br></br>
        <p className="warning-pregnant-dialog_description">{en.menstrualPeriod.PREGNANT_WARNING.SUBTITLE}</p>
        <br></br>
      </div>
      <Button color="primary" title="Return to docentrx.com" onClick={() => handleSubmit()} />
      <br></br>
      <Button color="transparent" title="Back" onClick={() => handleBack()} />
    </React.Fragment>
  );

  return (
    <div className="questionnaire">
      <h3 className="questionnaire__title">{question}</h3>
      {description.length ? <p className="questionnaire__description">{description}</p> : null}
      <div className="questionnaire__content">{children}</div>
      {error && <span className="error-text">{error.message}</span>}
      <div className="questionnaire__button-wrapper d-flex">
        {showBackButton ? <Button title="Back" color="secondary" onClick={handleBackClick} className="mr-4" /> : null}
        <Button
          title={QUESTION_STEP.size === currentStep + 1 ? 'Complete assessment' : 'Continue'}
          onClick={handleContinueClick}
        />
      </div>
      {skipLink && (
        <div className="none-text text-center">
          <a href="#" onClick={handleSkipLinkClick} role="button">
            {skipLink}
          </a>
        </div>
      )}
      {isPregnantWarningDialogOpen ? <WarningDialog customBody={warningBody()}></WarningDialog> : null}
    </div>
  );
};

export default Questionnaire;

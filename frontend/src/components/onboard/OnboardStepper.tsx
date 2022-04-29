import * as React from 'react';

import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';
import { GetStepIcon, StepperConnector, StyledStepLabel } from 'components/common/Stepper';
import { startCase } from 'lodash';

interface OnboardStepperProps {
  activeStep: number;
  steps: string[];
}

const OnboardStepper: React.FC<OnboardStepperProps> = ({ activeStep, steps }) => {
  const totalAssessmentStep = steps.length;
  const readableStep = activeStep + 1;

  return (
    <React.Fragment>
      <div className="assessment-stepper__steps-mobile">
        <span>
          Section {readableStep > totalAssessmentStep ? totalAssessmentStep : readableStep} of {totalAssessmentStep}
        </span>
        <span className="assessment-stepper__dash"></span>
        <span className="assessment-stepper__label">{startCase(steps[activeStep])}</span>
      </div>
      <Stepper activeStep={activeStep} alternativeLabel connector={<StepperConnector />}>
        {steps.map(label => (
          <Step key={label}>
            <StyledStepLabel StepIconComponent={GetStepIcon}>{label}</StyledStepLabel>
          </Step>
        ))}
      </Stepper>
    </React.Fragment>
  );
};

export default OnboardStepper;

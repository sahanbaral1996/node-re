import * as React from 'react';

import { Step, Stepper } from '@material-ui/core';
import { startCase } from 'lodash/fp';
import { GetStepIcon, StepperConnector, StyledStepLabel } from 'components/common/Stepper';
interface AssessmentStepperProps {
  activeStep: number;
  steps: string[];
}

const AssessmentStepper: React.FunctionComponent<AssessmentStepperProps> = ({ activeStep, steps }) => {
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
      <Stepper alternativeLabel activeStep={activeStep} connector={<StepperConnector />}>
        {steps.map(label => (
          <Step key={label}>
            <StyledStepLabel StepIconComponent={GetStepIcon}>{startCase(label)}</StyledStepLabel>
          </Step>
        ))}
      </Stepper>
    </React.Fragment>
  );
};

export default AssessmentStepper;

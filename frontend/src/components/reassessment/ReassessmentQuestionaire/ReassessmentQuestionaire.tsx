import * as React from 'react';

import { useFormik } from 'formik';
import { useHistory } from 'react-router';

import PeelingScale from './PeelingScale';
import CurrentCondition from './CurrentConditon';
import Border from 'components/common/Border';
import RadioGroupDetail from './RadioGroupDetail';
import ReveaScale from 'components/common/ReveaScale';
import Questionnaire from 'components/common/Questionaire';
import CheckboxGroup from 'components/common/CheckBoxGroup';
import Textarea from 'components/common/Textarea/Textarea';
import RadioGroup from 'components/common/RadioGroup/RadioGroup';

import {
  REASSESSMENT_STEPS,
  RessessmentOption,
  ReassessmentOptionType,
  reassessmentInitialFormValue,
  DynamicScaleOption,
  ExtendedReassessmentOptionType,
} from './reassessment.config';
import { en } from 'constants/lang';
import * as routes from 'constants/routes';
import { ReassessmentQuestionareProps } from 'types/reassessment';
import HeaderLine from 'components/common/HeaderLine';

const NONE_VALUE = ['notCurrentlyPrescribed', 'noneOfTheAbove'];
const SCALE = 10;
const FIRST_STEP = 1;
const NO = 'No';

/**
 * ReassessmentQuestionare Main Component.
 */
const ReassessmentQuestionaire: React.FC<ReassessmentQuestionareProps> = ({ reassessment, onSubmit, initialStep }) => {
  const [currentStep, setCurrentStep] = React.useState<number>(initialStep);
  const initialQuestion = REASSESSMENT_STEPS.find(reassessment => reassessment.sequence === initialStep);
  const [currentQuestion, setCurrentQuestion] = React.useState<any>(initialQuestion);

  const history = useHistory();

  const formik = useFormik({
    initialValues: reassessment,
    onSubmit: () => {},
  });

  React.useEffect(() => {
    const newQuestion = REASSESSMENT_STEPS.find(reassessment => reassessment.sequence === currentStep);

    if (newQuestion) {
      setCurrentQuestion(newQuestion);
    }
  }, [currentStep, setCurrentQuestion]);

  const handleContinueClick = (step?: number) => {
    const newStep = step || currentStep + 1;

    if (step === 3) {
      formik.setFieldValue('rednessIrritationScale.rating', '');
      formik.setFieldValue('rednessIrritationScale.description', '');
    }

    if (currentStep === REASSESSMENT_STEPS.length) {
      onSubmit(formik.values);

      return;
    }

    setCurrentStep(newStep);
  };

  const handleBackClick = (step?: number) => {
    if ((step && step < FIRST_STEP) || currentStep <= FIRST_STEP) {
      history.push(routes.HOME);

      return;
    }
    const newStep = step || currentStep - 1;

    setCurrentStep(newStep);
  };

  const onPeelingScaleChange = (value: number) => {
    formik.setFieldValue('rednessIrritationScale.rating', value);
  };

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>, name: string, value: string) => {
    formik.setFieldValue(`${name}.value`, value);

    if (value === NO) {
      formik.setFieldValue(`${name}.description`, '');
    }

    formik.handleChange(event);
  };

  const onPeelingChange = (event: React.ChangeEvent<HTMLTextAreaElement>, name: string, value: string) => {
    formik.setFieldValue(`${name}.status`, value);

    if (value === NO) {
      formik.setFieldValue(`${name}.description`, '');
      formik.setFieldValue(`${name}.rating`, '');
    }

    formik.handleChange(event);
  };

  const handleCheckboxGroupChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: keyof typeof reassessmentInitialFormValue
  ) => {
    if (NONE_VALUE.includes(event.target.value) && event.target.checked) {
      formik.setFieldValue(event.target.name, [event.target.value]);

      return;
    }

    if (!NONE_VALUE.includes(event.target.value) && event.target.checked) {
      const values = (formik.values[name] as string[]).filter(value => !NONE_VALUE.includes(value));

      formik.setFieldValue(event.target.name, [...values, event.target.value]);

      return;
    }

    formik.handleChange(event);
  };

  const renderQuestionBody = (question: RessessmentOption | DynamicScaleOption) => {
    switch (question.optionType) {
      case ReassessmentOptionType.Scale:
        return (
          <ReveaScale
            scale={SCALE}
            minLabel={en.reassessment.SKIN.MIN_LABEL}
            currentValue={formik.values[question.name]}
            maxLabel={en.reassessment.SKIN.MAX_LABEL}
            handleChange={event => formik.setFieldValue(question.name, event)}
          />
        );
      case ReassessmentOptionType.Checkbox:
        return (
          <CheckboxGroup
            values={formik.values[question.name] as string[]}
            name={question.name}
            handleChange={handleCheckboxGroupChange}
            options={question.options}
          ></CheckboxGroup>
        );
      case ReassessmentOptionType.RadioWithDetail:
        return (
          <RadioGroupDetail
            textArea={question.textarea}
            name={question.name}
            options={question.options}
            item={formik.values[question.name]}
            handleChange={onRadioGroupChange}
          />
        );
      case ReassessmentOptionType.Radio:
        return (
          <RadioGroup
            name={question.name}
            options={question.options}
            value={formik.values[question.name]}
            handleChange={formik.handleChange}
          />
        );
      case ReassessmentOptionType.PeelingScale:
        return (
          <PeelingScale
            name={question.name}
            onPeelingScaleChange={onPeelingScaleChange}
            value={formik.values[question.name]}
            handleChange={onPeelingChange}
          />
        );
      case ReassessmentOptionType.CurrentCondition:
        return (
          <CurrentCondition
            name={question.name}
            value={formik.values[question.name]}
            handleChange={formik.handleChange}
          />
        );

      case ExtendedReassessmentOptionType.DynamicPeeling: {
        const formikValues = formik.values[question.name];
        const rating = formikValues[question.ratingName];
        const secondaryField = formikValues[question?.secondaryFieldName || ''];

        return (
          <React.Fragment>
            <ReveaScale
              scale={SCALE}
              minLabel={question.minLabel}
              currentValue={rating}
              maxLabel={question.maxLabel}
              handleChange={value => formik.setFieldValue(`${question.name}.${question.ratingName}`, value)}
            />
          </React.Fragment>
        );
      }
    }
  };

  return (
    <>
      <HeaderLine />
      <div className="reassement__wrapper">
        <Questionnaire
          question={currentQuestion.question}
          description={currentQuestion.description}
          onContinueClick={handleContinueClick}
          onBackClick={handleBackClick}
          skipLink={currentQuestion.skipLink}
          skipPrev={currentQuestion.skipPrev}
          skipNext={currentQuestion.skipNext}
          currentState={formik.values}
          currentStep={currentStep}
          validation={currentQuestion.validation}
          name={currentQuestion.name}
        >
          {renderQuestionBody(currentQuestion)}
        </Questionnaire>
      </div>
    </>
  );
};

export default ReassessmentQuestionaire;

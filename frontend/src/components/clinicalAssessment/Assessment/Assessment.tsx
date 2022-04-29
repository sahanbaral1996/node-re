import * as React from 'react';
import { useFormik } from 'formik';

import CheckWithDetail from './CheckWithDetail';
import TopicalRetinoid from './TopicalRetinoid';
import MenstrualPeriods from './MenstrualPeriods';
import AssessmentComplete from './AssessmentComplete';
import Border from 'components/common/Border/Border';
import Questionnaire from '../../common/Questionaire';
import CheckboxGroup from '../../common/CheckBoxGroup';
import Textarea from 'components/common/Textarea/Textarea';
import RadioGroup from '../../common/RadioGroup/RadioGroup';

import {
  AssessmentOption,
  QUESTION_STEP,
  assessmentInitialFormValue,
  QUESTION_SET,
  QUESTIONS,
  NONE_VALUE,
} from './assessment.config';
import {
  AssessmentFlow,
  AssessmentOptionType,
  HasExplanation,
  Medication as AssessmentMedication,
  SkinType as AssessmentSkinType,
} from 'types/assessment';
import { AssessmentProps } from './assessment.config';
import { assessmentSchema } from 'schemas/assessmentSchemas';
import { setValue } from 'utils/localStorage';
import { LOCAL_STORAGE_ASSESSMENT } from 'constants/assessment';
import RadioWithOtherExplanation from './RadioWithOtherExplanation';
import Allergy from './Allergy';
import AssessmentStepper from './AssessmentStepper';
import YesNoWithDetail from './YesNoWithDetail';
import SkinType from './SkinType';
import Medication from './Medication';

const RADIO = 'radio';
const OTHER = 'Other';

/**
 * Component to render the assessment questions and its relevant logics.
 */
const Assessment: React.FC<AssessmentProps> = ({
  onSubmit,
  initialFormValue,
  onBack,
  initialStep,
  showProgress,
  currentFlow,
  setCurrentFlow,
}) => {
  const initialQuestion = QUESTION_STEP.get(initialStep);

  const [currentQuestion, setCurrentQuestion] = React.useState<AssessmentOption>(initialQuestion);

  const [currentStep, setCurrentStep] = React.useState<number>(initialStep);

  const activeParentStep = () => {
    const parentQuestion = QUESTION_SET.find(questionSet => questionSet.questions.includes(currentStep));

    return parentQuestion?.parentStep || 0;
  };

  const formik = useFormik({
    initialValues: initialFormValue,
    validationSchema: assessmentSchema,
    onSubmit: () => {},
  });

  React.useEffect(() => {
    const newQuestion = QUESTION_STEP.get(currentStep);

    if (newQuestion) {
      setCurrentQuestion(newQuestion);
    }
  }, [currentStep, setCurrentQuestion]);

  React.useEffect(() => {
    const assessmentInfo = {
      step: currentStep,
      formValue: formik.values,
    };

    setValue(LOCAL_STORAGE_ASSESSMENT, assessmentInfo);
  }, [currentStep, formik.values]);

  // Event Handlers
  const handleContinueClick = (step?: number) => {
    const newStep = step || currentStep + 1;

    if (!QUESTION_STEP.has(newStep)) {
      setCurrentFlow(AssessmentFlow.SUCCESS);
      onSubmit({ ...formik.values });

      return;
    }

    setCurrentStep(newStep);
  };

  const handleBackClick = (step?: number) => {
    const newStep = step !== undefined ? step : currentStep - 1;

    if (!QUESTION_STEP.has(newStep)) {
      // Handle back click here
      onBack(formik.values);

      return;
    }
    setCurrentStep(newStep);
  };

  const handleCheckboxGroupChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: keyof typeof assessmentInitialFormValue
  ) => {
    if (event.target.value === NONE_VALUE && event.target.checked) {
      formik.setFieldValue(event.target.name, [NONE_VALUE]);

      return;
    }

    if (event.target.value !== NONE_VALUE && event.target.checked) {
      const values = (formik.values[name] as string[]).filter(value => value !== NONE_VALUE);

      formik.setFieldValue(event.target.name, [...values, event.target.value]);

      return;
    }

    formik.handleChange(event);
  };

  const handleCheckWithDetailChange = (
    event: React.ChangeEvent<any>,
    name: keyof typeof assessmentInitialFormValue,
    field?: string
  ) => {
    if (event.target.value === NONE_VALUE && event.target.checked) {
      const newValues: { [key: string]: string | string[] } = {};

      const currentValue = formik.values[name] as { [key: string]: string | string[] };

      Object.keys(currentValue).forEach(key => {
        newValues[key] = Array.isArray(currentValue[key]) ? [] : '';
      });

      newValues['none'] = [NONE_VALUE];

      formik.setFieldValue(name, newValues);

      return;
    }

    if (event.target.value !== NONE_VALUE && event.target.checked && field) {
      const values = formik.values[name] as { [key: string]: string | string[] };

      formik.setFieldValue(name, {
        ...values,
        [field]: [event.target.value],
        none: [],
      });

      return;
    }

    formik.handleChange(event);
  };

  const handleRadioOtherExplanationChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    previousValue: string,
    textBoxName: string
  ) => {
    if (event.target.type === RADIO && previousValue === OTHER) {
      formik.setFieldValue(textBoxName, '');
    }

    formik.handleChange(event);
  };

  const renderQuestionBody = (question: AssessmentOption) => {
    const { optionType, name, options, label, placeholder } = question;

    switch (optionType) {
      case AssessmentOptionType.Radio:
        return (
          <RadioGroup
            name={name}
            options={options}
            value={formik.values[question.name] as string}
            handleChange={formik.handleChange}
          />
        );
      case AssessmentOptionType.Checkbox:
        return (
          <CheckboxGroup
            options={options}
            values={formik.values[question.name] as string[]}
            name={name}
            handleChange={handleCheckboxGroupChange}
          />
        );
      case AssessmentOptionType.CheckWithDetail:
        return (
          <CheckWithDetail
            name={name}
            options={options}
            values={formik.values[question.name] as { [key: string]: any }}
            handleChange={handleCheckWithDetailChange}
          />
        );
      case AssessmentOptionType.TopicalRetinoid:
        return (
          <TopicalRetinoid
            {...formik.values['topicalRetinoid']}
            name={name}
            handleChange={formik.handleChange}
            setFieldValue={formik.setFieldValue}
          />
        );
      case AssessmentOptionType.TextArea:
        return (
          <Border>
            <Textarea
              label={label || ''}
              placeholder={placeholder}
              onChange={formik.handleChange}
              value={formik.values[question.name]}
              name={name}
            />
          </Border>
        );
      case AssessmentOptionType.Medication:
        return (
          <Medication
            name={question.name}
            values={formik.values[question.name] as AssessmentMedication}
            handleChange={formik.handleChange}
            setFieldValue={formik.setFieldValue}
          />
        );
      case AssessmentOptionType.MenstrualPeriod:
        return (
          <MenstrualPeriods
            {...formik.values['menstrualPeriod']}
            name={name}
            handleChange={formik.handleChange}
            setFieldValue={formik.setFieldValue}
          />
        );
      case AssessmentOptionType.RadioWithOtherExplanation:
        return (
          <RadioWithOtherExplanation
            {...formik.values[name]}
            name={name}
            handleChange={handleRadioOtherExplanationChange}
            options={options}
            radioName={`${name}.gender`}
            textBoxName={`${name}.otherExplanation`}
          />
        );
      case AssessmentOptionType.Allergy:
        return (
          <Allergy
            yesMedication={formik.values.allergy.medications.has}
            yesMushroom={formik.values.allergy.mushrooms.has}
            explanation={formik.values.allergy.medications.explanation}
            name={name}
            onChange={formik.handleChange}
            setFieldValue={formik.setFieldValue}
          />
        );
      case AssessmentOptionType.RadioWithDetail:
        return (
          <YesNoWithDetail
            values={formik.values[question.name] as HasExplanation}
            name={name}
            handleChange={formik.handleChange}
            label={label || ''}
            placeholder={placeholder}
            setFieldValue={formik.setFieldValue}
          />
        );
      case AssessmentOptionType.SkinType:
        return (
          <SkinType
            values={formik.values[question.name] as AssessmentSkinType}
            name={name}
            handleSensitivityChange={formik.handleChange}
            handleSkinTypeChange={formik.handleChange}
          />
        );
    }
  };

  const renderQuestions = () => {
    if (!currentQuestion) {
      return null;
    }

    const { question, description, skipLink, skipNext, skipPrev, name, validation, showBackButton } = currentQuestion;

    return (
      <Questionnaire
        question={question}
        description={description}
        skipLink={skipLink}
        skipPrev={skipPrev}
        skipNext={skipNext}
        currentState={formik.values}
        currentStep={currentStep}
        validation={validation}
        name={name}
        onBackClick={handleBackClick}
        onContinueClick={handleContinueClick}
        showBackButton={showBackButton}
      >
        {renderQuestionBody(currentQuestion)}
      </Questionnaire>
    );
  };

  const renderContent = () => {
    switch (currentFlow) {
      case AssessmentFlow.QUESTIONS:
        return <div className="assessment__content assessment-wrapper container">{renderQuestions()}</div>;
      case AssessmentFlow.SUCCESS:
        return <AssessmentComplete />;
    }
  };

  return (
    <div className="assessment container">
      {showProgress ? <AssessmentStepper activeStep={activeParentStep()} steps={[...QUESTIONS.keys()]} /> : null}
      {renderContent()}
    </div>
  );
};

export default Assessment;

import * as React from 'react';

import YesNoWithDetail from './YesNoWithDetail';

import { HasExplanation, MedicationProps } from 'types/assessment';

import { en } from 'constants/lang';

const Medication: React.FC<MedicationProps> = ({ name, values, handleChange, setFieldValue }) => {
  return (
    <div>
      <YesNoWithDetail
        values={values.specificMedication as HasExplanation}
        name={`${name}.specificMedication`}
        handleChange={handleChange}
        label={en.medication.specificMedication.LABEL}
        placeholder={en.medication.specificMedication.PLACEHOLDER}
        setFieldValue={setFieldValue}
      />
      <div className="mt-4x">
        <div className="questionnaire__description">{en.medication.opposedToAnyMedication.TITLE}</div>
        <YesNoWithDetail
          values={values.opposedToAnyMedication as HasExplanation}
          name={`${name}.opposedToAnyMedication`}
          handleChange={handleChange}
          label={en.medication.opposedToAnyMedication.LABEL}
          placeholder={en.medication.opposedToAnyMedication.PLACEHOLDER}
          setFieldValue={setFieldValue}
        />
      </div>
    </div>
  );
};

export default Medication;

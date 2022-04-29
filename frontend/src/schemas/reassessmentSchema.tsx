import * as yup from 'yup';
import { MAX_CHARACTERS, STRING_MAX_MESSAGE } from 'constants/assessment';

const skinResponseToCurrentRegimenSchema = yup.object({
  rating: yup.mixed().required('Please select your rating.'),
});

const newMedicationSchema = yup.object({
  value: yup.string().required('Please select a value.'),
  description: yup
    .string()
    .max(MAX_CHARACTERS, `Lifestyle changes must be at most ${STRING_MAX_MESSAGE} characters.`)
    .when('value', (value: string) => {
      if (value === 'Yes') {
        return yup.string().required('Please share the medication type');
      }

      return yup.string().notRequired();
    }),
});

const lifestyleChangesSchema = yup.object({
  value: yup.string().required('Please select a value.'),
  description: yup
    .string()
    .max(MAX_CHARACTERS, `Lifestyle changes must be at most ${STRING_MAX_MESSAGE} characters.`)
    .when('value', (value: string) => {
      if (value === 'Yes') {
        return yup.string().required('Please share the lifestyle changes.');
      }

      return yup.string().notRequired();
    }),
});
const pregnancyInThreeMonthsSchema = yup
  .string()
  .required('Please select whether you are deciding to get pregnant in three months.');

const hydroquinoneSchema = yup.array().min(1, 'Please select any of the above.');

const retinoidSchema = yup.array().min(1, 'Please select any of the above.');

const rednessIrritationPeelingRadio = yup.string().required('Please select a value.');

const rednessIrritationPeelingSchema = yup.object({
  description: yup.string().max(MAX_CHARACTERS, `Redness, irritation or peeling location ${STRING_MAX_MESSAGE}`),
});
const currentConditionSchema = yup.string().max(MAX_CHARACTERS, `Skin current condition ${STRING_MAX_MESSAGE}`);

export {
  rednessIrritationPeelingRadio,
  skinResponseToCurrentRegimenSchema,
  newMedicationSchema,
  lifestyleChangesSchema,
  pregnancyInThreeMonthsSchema,
  hydroquinoneSchema,
  retinoidSchema,
  rednessIrritationPeelingSchema,
  currentConditionSchema,
};

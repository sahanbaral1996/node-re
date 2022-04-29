import * as yup from 'yup';

export const nameRegistration = yup.object({
  firstName: yup
    .string()
    .min(2)
    .label('first name')
    .matches(/^[A-Za-z_ ]+$/, 'Please enter valid first name e.g Stella')
    .required('Please provide your first name'),
  lastName: yup
    .string()
    .min(2)
    .label('last name')
    .matches(/^[A-Za-z_ ]+$/, 'Please enter valid last name e.g Gurbner')
    .required('Please provide your last name'),
});

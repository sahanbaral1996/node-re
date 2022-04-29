import * as yup from 'yup';

export const changeEmailSchema = yup.object({
  email: yup.string().email('Email must be a valid email.').required('Please provide new email address.'),
  password: yup.string().required('Please provide your current password.'),
});

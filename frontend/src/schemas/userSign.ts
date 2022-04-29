import * as yup from 'yup';

export const userSignInSchema = yup.object({
  email: yup.string().email().required('Please provide your email address'),
  password: yup.string().required('Please provide your password'),
});

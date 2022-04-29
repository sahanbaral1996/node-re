import * as yup from 'yup';

export const createPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Please provide your password')
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&\/,><\':;|_~])\S{8,99}$/,
      'Password must contain at least 8 characters, one lowercase, one number and one special case character'
    ),
  confirmPassword: yup
    .string()
    .required('Please provide your confirm password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

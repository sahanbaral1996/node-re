import * as yup from 'yup';

export const userRegistrationSchema = yup.object({
  email: yup.string().email().required('Please provide your email address'),
  dob: yup.mixed().required('Please provide a valid date for your birthday'),
  firstName: yup
    .string()
    .matches(/^[A-Za-z_ ]+$/, 'Please enter valid first name e.g Stella')
    .required('Please provide your first name'),
  lastName: yup
    .string()
    .matches(/^[A-Za-z_ ]+$/, 'Please enter valid last name e.g Gurbner')
    .required('Please provide your last name'),
});

export const userIdentityRegistration = yup.object({
  email: yup.string().min(6).email().required('Please provide your email address'),
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

export const userAccountRegistration = yup.object({
  email: yup.string().min(6).email().required('Please provide your email address'),
  password: yup
    .string()
    .required('Please provide your password')
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&\/,><\':;|_~])\S{8,99}$/,
      'Password must contain at least 8 characters, one lowercase, one number and one special case character'
    ),
  noppToa: yup.boolean().oneOf([true], 'You must agree to Privacy Policy and Terms of Service'),
  confirmPassword: yup
    .string()
    .required('Please provide your confirm password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const userDetailsRegistration = yup.object({
  dob: yup.mixed().required('Please provide a valid date for your birthday'),
  state: yup.string().required('Please select your state'),
  noppToa: yup.boolean().oneOf([true], 'You must agree to Privacy Policy and Terms of Service'),
  phone: yup.string().min(2).optional(),
});

export const UserEligibility = yup.object({
  dob: yup.mixed().required('Please provide a valid date for your birthday'),
  state: yup.string().required('Please select your state'),
});

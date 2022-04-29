import * as yup from 'yup';

export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required('Please provide your current password.'),
  newPassword: yup
    .string()
    .required('Please provide your new password.')
    .matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/, {
      message:
        'New password must contain at least 8 characters, a number, a special character and at least one lowercase letter.',
    }),
  confirmPassword: yup
    .string()
    .test(
      'passwords-match',
      'Confirm password must match the new password.',
      (value, context) => context.parent.newPassword === value
    )
    .required('Please confirm your new password.'),
});

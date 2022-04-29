import * as yup from 'yup';

export const createPasswordSchema = yup.object({
  description: yup.string().required('Please provide what specific product and concentration did you use.'),
});

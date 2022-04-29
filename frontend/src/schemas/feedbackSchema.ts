import * as yup from 'yup';

export const feedbackSchema = yup.object({
  description: yup.string().required('Please provide your query description'),
});

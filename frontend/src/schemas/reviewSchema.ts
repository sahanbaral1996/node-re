import * as yup from 'yup';
import { boolean, number, string } from 'yup/lib/locale';

export const reviewSchema = yup.object({
  rating: yup.number().required('Please provide a rating'),
  recommend: yup.boolean().required('Please choose a toggle'),
  yourExperience: yup.string().required('Please provide your experience'),
});

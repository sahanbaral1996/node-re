import * as yup from 'yup';

const addressSchema = yup.object({
  lineOne: yup.string().required('Please provide your address one'),
  lineTwo: yup.string().optional(),
  city: yup.string().required('Please provide your city'),
  state: yup.string().required('Please select your state'),
  country: yup.string().required('Please select your country'),
  zip: yup
    .string()
    .trim()
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Please enter valid zip code')
    .required('Please provide your zip'),
});

const cardSchema = yup.object({
  token: yup.string(),
  type: yup.string().required(''),
  number: yup.string().required('Please provide your credit card number'),
  expiry: yup.string().required('Please provide your credit card expiration date'),
  cvv: yup.string().required('Please provide your credit card cvv'),
});

const setupSubscriptionSchema = yup.object({
  shippingAddress: addressSchema,
  isSameAsShippingAddress: yup.boolean().required(),
  billingAddress: yup.object().when('isSameAsShippingAddress', {
    is: true,
    then: yup.object().optional(),
    otherwise: addressSchema.required(),
  }),
  card: cardSchema,
  phone: yup.string().min(10, 'Please provide valid phone number').required('Please provide your phone number'),
});

export default setupSubscriptionSchema;

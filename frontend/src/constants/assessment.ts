export const MAX_CHARACTERS = 5000;
export const STRING_MAX_MESSAGE = `must be at most ${MAX_CHARACTERS} characters.`;
export const INITIAL_STEP = 0;
export const LOCAL_STORAGE_ASSESSMENT = 'assessment';
export const LOCAL_STORAGE_REGISTRATION = 'registration';
export const LOCAL_STORAGE_ELIGIBILITY = 'eligibility';
export const GENDER_IDENTITY_EXPLANATION_MAX_CHARACTER = 250;

export const SENSITIVITY_OPTIONS = [
  { value: 'I can use most products without discomfort', label: 'I can use most products without discomfort' },
  {
    value: 'Sometimes products irritate my skin',
    label: 'Sometimes products irritate my skin ',
  },
  {
    value: "It's hard for me to find products that my skin tolerates",
    label: "It's hard for me to find products that my skin tolerates",
  },
];

export const SKIN_DRYNESS_OPTIONS = [
  {
    value: '1',
    label: 'Very dry',
  },
  {
    value: '2',
    label: 'Dry',
  },
  {
    value: '3',
    label: 'Combination',
  },
  {
    value: '4',
    label: 'Oily',
  },
  {
    value: '5',
    label: 'Very oily',
  },
];

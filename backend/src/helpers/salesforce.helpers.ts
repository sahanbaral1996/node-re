import { YES } from 'constants/salesforce/assessment.constants';
import { prop, compose, values, pick, complement, isNil, filter, curry, path } from 'ramda';
import { IAddress, IAddressInformation } from 'types/salesforce/address.types';
import { IReassesmentDTO } from 'types/customer.service.types';
import { ISkinConditions, IHasExplanation, IMenstrualPeriod, IGender } from 'types/salesforce/assessment.types';

import { IOrder } from 'types/salesforce/order.types';

export const getRecords = prop('records');

export const lisAllowedState = [
  'Florida',

  'Texas',

  'Idaho',

  'Washington',

  'California',

  'Pennsylvania',

  'Georgia',

  'Colorado',

  'Michigan',

  'Minnesota',

  'Nevada',

  'Montana',

  'Arizona',

  'Hawaii',

  'Ohio',

  'New Jersey',

  'Utah',

  'Virginia',

  'North Carolina',

  'New York',
];

export const getIndividualGoals = compose<IOrder, Pick<IOrder, 'goal1' | 'goal2' | 'goal3'>, any, string[]>(
  values,
  filter(complement(isNil)),
  pick(['goal1', 'goal2', 'goal3'])
);

export const checkIfAllowedState = (state?: string) => {
  return state ? (lisAllowedState.includes(state) ? true : false) : false;
};

export const getInQuotes = (value: string) => `'${value}'`;

export const isDateRangeDefined = (startDate, endDate) => startDate && endDate;
/**
 * camel case string
 *
 * @param {String} str
 */
export const camelize = str => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+|_/g, '');
};

/**
 * change object keys to camelCase from salesforce query result
 *
 * @param {Object} obj
 */
export const getCamelCasedObject = (obj): any => {
  if (!obj) {
    return obj;
  }
  const newObj = {};
  Object.keys(obj).forEach(item => {
    const newKey = camelize(item.replace(/__r|__pc|__c/g, ''));
    newObj[newKey] = obj[item];
  });
  return newObj;
};

export const addPrefixToFiles = curry(
  (prefix: string, { originalname, buffer }: { originalname: string; buffer: Buffer }) => ({
    prefixedFileName: `${prefix}-${originalname}`,
    body: buffer.toString('base64'),
  })
);

export const reassessmentDTOtoSalesforceParams = (reassessmentDTO: IReassesmentDTO) => {
  const hydroNotPrescribed = path(['hydroquinone', 'notCurrentlyPrescribed'], reassessmentDTO);

  const adjustedReassessment = {
    Skin_Response_to_Regimen__c: path(['skinResponseToCurrentRegimen'], reassessmentDTO),
    Redness_Irritation_or_Peeling__c: path(['rednessIrritationPeelingStatus'], reassessmentDTO),
    Redness_Irritation_or_Peeling_Rating__c: path(['rednessIrritationPeelingRating'], reassessmentDTO),
    Redness_Irritation_or_Peeling_Location__c: path(['rednessIrritationPeelingLocation'], reassessmentDTO),
    New_Meds_Since_Last_Assessment__c: path(['newMedication'], reassessmentDTO),
    New_Medication_Type__c: path(['newMedicationType'], reassessmentDTO),
    Current_Condition__c: path(['currentCondition'], reassessmentDTO),
    Pregnancy_Status__c: path(['pregnancyInThreeMonths'], reassessmentDTO),
    Darkening_of_Spots__c: path(['hydroquinone', 'darkeningOfSpots'], reassessmentDTO),
    Fishy_Taste_or_Smell__c: path(['hydroquinone', 'fishyTasteOrSmell'], reassessmentDTO),
    Orange_Discoloration__c: path(['hydroquinone', 'orangeDiscoloration'], reassessmentDTO),
    Not_Currently_Prescribed_Hydroquinone__c: hydroNotPrescribed === YES ? true : false,
    Increased_Sun_Sensitivity__c: path(['retinoidsSideEffects', 'increasedSunSensitivity'], reassessmentDTO),
    Rash_or_Redness__c: path(['retinoidsSideEffects', 'rashRedness'], reassessmentDTO),
  };

  return adjustedReassessment;
};

export const getIndividualSkinConditions = (skinConditions: string): ISkinConditions[] => {
  if (!skinConditions) {
    return [];
  }
  const individualSkinConditions = skinConditions.split(',').map(item => ISkinConditions[item.trim()]) || [];
  return individualSkinConditions as ISkinConditions[];
};

export const formatHasExplanation = (input: IHasExplanation) =>
  `${input.has}${input.explanation ? ` ${input.explanation}` : ''}`;

export const formatMenstrualPeriodReason = (input?: IMenstrualPeriod) => {
  return input?.doesOccur === 'No' ? ` ${input.whyNot} ${input.whyNot === 'Other' ? input.explanation : ''}` : '';
};

export const formatGenderIdentity = (input: IGender) =>
  `${input.gender}${input.gender === 'Other' ? ` ${input.otherExplanation}` : ''}`;

export const getAddressInformation = (address: IAddress | null): IAddressInformation => {
  const addressInformation: IAddressInformation = {
    street: undefined,
    city: undefined,
    postalCode: undefined,
    country: undefined,
    state: undefined,
  };
  if (address) {
    addressInformation.street = `${address.line1 || ''} ${address.line2 || ''}`;
    addressInformation.city = address.city;
    addressInformation.state = address.state;
    addressInformation.postalCode = address.zip;
  }

  return addressInformation;
};

import container from 'container';

import { Connection } from 'jsforce';
import { getCamelCasedObject } from 'helpers/salesforce.helpers';

import { IContactInformation, ICreateAssessment } from 'types/salesforce/assessment.types';

import { formatGenderIdentity, formatHasExplanation, formatMenstrualPeriodReason } from 'helpers/salesforce.helpers';

import OperationException from 'api/exceptions/OperationException';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { ASSESSMENT, CREATE_OPERATION, DESTROY_OPERATION } from 'constants/salesforce/common.constants';

export const createAssessment = async (assessmentDetails: ICreateAssessment & IContactInformation): Promise<string> => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const response = await salesforceConnection.sobject(ASSESSMENT).create({
    Customer_DOB__c: assessmentDetails.dob,
    Customer_Email__c: assessmentDetails.email,
    Gender__c: formatGenderIdentity(assessmentDetails.genderIdentity),
    Acne__c: assessmentDetails.primarySkinConcernChoice1,
    Hyperpigmentation__c: assessmentDetails.primarySkinConcernChoice2,
    Skin_Texture_or_Firmness__c: assessmentDetails.primarySkinConcernChoice3,
    Rosacea__c: assessmentDetails.primarySkinConcernChoice4,
    Melasma__c: assessmentDetails.primarySkinConcernChoice5,
    Maskne__c: assessmentDetails.primarySkinConcernChoice6,
    Fine_Lines_and_Wrinkles__c: assessmentDetails.primarySkinConcernChoice7,
    PMH__c: formatHasExplanation(assessmentDetails.healthCondition),
    Derm_Treatment_History__c: assessmentDetails.treatmentHistory,
    Drug_Allergies__c: formatHasExplanation(assessmentDetails.medicationAllergy),
    Do_you_get_menstrual_periods__c: assessmentDetails.menstrualPeriod?.doesOccur || '',
    Reason_For_Not_Getting_Menstrual_Periods__c: formatMenstrualPeriodReason(assessmentDetails.menstrualPeriod),
    Mushroom_Allergy__c: formatHasExplanation(assessmentDetails.mushroomAllergy),
    Describe_Your_Skin__c: assessmentDetails.skinType,
    Skin_Sensitive__c: assessmentDetails.skinSensitivity,
    Meds_Desired__c: formatHasExplanation(assessmentDetails.specificMedication),
    Meds_Unwanted__c: formatHasExplanation(assessmentDetails.opposedToAnyMedication),
    Are_you_ok_with_oral_medication__c: assessmentDetails.oralMedication,
    OTC_Acids__c: assessmentDetails.otcMedication2,
    OTC_Antibiotic_Cream__c: assessmentDetails.otcMedication3,
    OTC_Hydroquinone__c: assessmentDetails.otcMedication5,
    OTC_Medications_Washes__c: assessmentDetails.otcMedication1,
    OTC_Other__c: assessmentDetails.otcMedication6,
    Other_Medications__c: formatHasExplanation(assessmentDetails.otherMedication),
    Person_Account__c: assessmentDetails.accountId,
    Pregnancy_Status__c: assessmentDetails.prescriptionDuringPregnancy,
    Total_Retinoid__c: assessmentDetails.topicalRetinoid?.hasUsed,
    Are_you_still_using_a_retinoid__c: assessmentDetails.topicalRetinoid?.stillUsing,
    Total_Retinoid_1__c: assessmentDetails.topicalRetinoid?.specificProduct,
    Total_Retinoid_4__c: assessmentDetails.topicalRetinoid?.skinToleration,
    Total_Retinoid_5__c: assessmentDetails.topicalRetinoid?.dosage,
  });
  if (!response.success) {
    throw new OperationException(response.errors, ASSESSMENT, CREATE_OPERATION);
  }

  return response.id;
};

export const saveReassessment = async (accountId: string, reassessment, recordTypeId: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const accountRecordResponse = await salesforceConnection.sobject(ASSESSMENT).create({
    Person_Account__c: accountId,
    RecordTypeId: recordTypeId,
    ...reassessment,
  });

  if (!accountRecordResponse.success) {
    throw new OperationException(accountRecordResponse.errors, ASSESSMENT, CREATE_OPERATION);
  }

  return accountRecordResponse;
};

export const deleteAssessment = async (assessmentId: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const accountRecordResponse = await salesforceConnection.sobject(ASSESSMENT).destroy(assessmentId);

  if (!accountRecordResponse.success) {
    throw new OperationException(accountRecordResponse.errors, ASSESSMENT, DESTROY_OPERATION);
  }
  return accountRecordResponse.id;
};

export const getAsessmentDetail = async (accountId: string) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);
  const assessmentResponse = await salesforceConnection
    .sobject(ASSESSMENT)
    .findOne({ Person_Account__c: accountId })
    .execute();
  return getCamelCasedObject(assessmentResponse);
};

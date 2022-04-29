import { ICreateAssessment } from './salesforce/assessment.types';
import { ISetupSubscription } from './subscription.service.types';

export interface IPersonDetails {
  email: string;
  leadId: string;
  assessment: ICreateAssessment;
}

export interface ICreatePersonDetailsByAdmin extends ISetupSubscription {
  leadId: string;
}

import OperationException from 'api/exceptions/OperationException';
import { SALESFORCE_TOKEN } from 'constants/app.constants';
import { CREATE_OPERATION } from 'constants/salesforce/common.constants';
import container from 'container';
import { Connection, SuccessResult } from 'jsforce';

interface IReviewConfig {
  Rating__c: number;
  Recommend__c: boolean;
  Your_Experience__c: string;
  Person__c: string;
}

const REVIEW = 'Review__c';

export const createReview = async (accountId: string, review: any) => {
  const salesforceConnection: Connection = container.resolve(SALESFORCE_TOKEN);

  const reviewObject = {
    Person__c: accountId,
    Rating__c: review.rating,
    Recommend__c: review.recommend,
    Your_Experience__c: review.yourExperience,
  };

  const response = await salesforceConnection.sobject<IReviewConfig>(REVIEW).create(reviewObject);

  if (response && !response.success) {
    throw new OperationException(response.errors, REVIEW, CREATE_OPERATION);
  }

  return response as SuccessResult;
};

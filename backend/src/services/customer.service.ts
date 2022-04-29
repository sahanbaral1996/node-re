import { compose, head, pick } from 'ramda';

import * as salesforceOrderService from './salesforce/order.service';
import * as salesforceOrderItemService from './salesforce/orderItem.service';
import * as salesforceDocumentService from './salesforce/document.service';
import * as salesforceCaseService from './salesforce/case.service';
import * as salesforceAddonService from './salesforce/addOnOrder.service';

import * as salesforceAssessmentService from './salesforce/assessment.service';
import * as addonService from 'services/salesforce/addOnOrder.service';

import * as chargebeeSubscriptionService from './chargebee/subscription.service';

import {
  getCamelCasedObject,
  getRecords,
  reassessmentDTOtoSalesforceParams,
  getIndividualGoals,
  camelize,
} from '../helpers/salesforce.helpers';

import { IDetailedPlan, OrderStatus } from 'types/salesforce/order.types';

import {
  ADMIN_USER_GROUP,
  COGNITO_USER,
  COGNITO_USER_FIRST_NAME,
  COGNITO_USER_LAST_NAME,
  CUSTOMER_USER_GROUP,
  LEAD_USER_GROUP,
  PERSON_USER_GROUP,
} from 'constants/cognito.constants';

import * as chargebeeService from 'services/chargebee/customer.service';
import * as accountService from 'services/salesforce/account.service';
import * as caseService from 'services/salesforce/case.service';

import userServiceFactory from './cognito/user.service';

import * as leadService from 'services/salesforce/lead.service';

import { IAssessmentRecordType, IAssessmentHyperpigmentationType } from 'types/salesforce/assessment.types';
import {
  ICreateCustomerDTO,
  IReassesmentDTO,
  ICustomerInformation,
  ICustomerOrderInformation,
  IAddonOrderInformation,
} from 'types/customer.service.types';

import { RECURRING_ASSESSMENT } from 'constants/salesforce/assessment.constants';
import container from 'container';
import winston from 'winston';
import APIError from 'api/exceptions/Error';

import * as userAccountService from 'services/account.service';
import lang from 'lang';
import { RecordResult, SuccessResult } from 'jsforce';
import { toSnakeCaseAttrNameValuePairs } from 'utils/object';
import NotFoundException from 'api/exceptions/NotFoundException';
import AlreadyExistsException from 'api/exceptions/AlreadyExistsException';
import {
  ANONYMOUS_LAST_NAME_PLACEHOLDER,
  CUSTOM_EVENT_EMITTER_TOKEN,
  PROMISE_FULFILLED,
  PROMISE_REJECTED,
} from 'constants/app.constants';
import OperationException from 'api/exceptions/OperationException';
import {
  ACCOUNT,
  LEAD,
  UPDATE_OPERATION,
  CREATE_OPERATION,
  READ_OPERATION,
  ADD_ON_ORDER,
  DELETE_OPERATION,
} from 'constants/salesforce/common.constants';
import {
  AdminDeleteUserCommandOutput,
  AdminUpdateUserAttributesCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { LeadStatus } from 'types/salesforce/lead.types';
import { EventEmitter } from 'events';

import { customerEvents } from 'subscribers/events';
import { IUser } from 'types/app.types';
import { IAdminUser } from 'types/user.service.types';
import { ContactStatus } from 'types/salesforce/contact.types';
import { createReview } from './salesforce/review.service';

export const createCustomer = async (createCustomerDTO: ICreateCustomerDTO) => {
  const userService = userServiceFactory();

  const { email, password, ...rest } = createCustomerDTO;

  const existingCognitoUser = await userService.getCognitoUserInPoolByEmail(createCustomerDTO.email);

  if (existingCognitoUser) {
    throw new AlreadyExistsException(COGNITO_USER, 'User already exists');
  }

  const existingLead = await leadService.findLeadByEmail(email);

  let leadId;
  let cognitoUserDetails;

  if (existingLead && existingLead.id) {
    leadId = existingLead.id;
    await leadService.updateLead({ id: leadId, leadDetails: { email, ...rest } });
  } else {
    const createdLead = await leadService.createLead({
      email,
      ...rest,
      lastName: ANONYMOUS_LAST_NAME_PLACEHOLDER,
    });
    leadId = createdLead.id;
  }

  try {
    cognitoUserDetails = await userService.createCognitoUserInPool({
      email,
      lastName: ANONYMOUS_LAST_NAME_PLACEHOLDER,
      accountReferenceId: leadId,
    });

    await userService.assignCognitoUserToGroup({
      email: createCustomerDTO.email,
      groupName: LEAD_USER_GROUP,
    });

    await userService.verifyUserEmail(email);
    const response = await userService.loginCognitoUser({
      email,
      password: password,
      temporaryPassword: cognitoUserDetails.temporaryPassword,
    });
    return response;
  } catch (error) {
    const rollbacks: Promise<AdminDeleteUserCommandOutput | SuccessResult>[] = [userService.deleteCognitoUser(email)];

    if (existingLead && existingLead.id) {
      rollbacks.push(leadService.deleteLead(leadId));
    }

    await Promise.all(rollbacks);

    throw error;
  }
};

export const getCustomerInformation = async (
  salesforceId: string,
  groupNames: string[],
  currentUser: IUser
): Promise<
  | (ICustomerInformation & ICustomerOrderInformation & IAssessmentHyperpigmentationType & IAddonOrderInformation)
  | IAdminUser
> => {
  try {
    if (currentUser.shouldMigrate) {
      const customEventEmitter: EventEmitter = container.resolve(CUSTOM_EVENT_EMITTER_TOKEN);
      customEventEmitter.emit(customerEvents.getCustomerInformation, { user: currentUser });
    }

    if (groupNames.includes(ADMIN_USER_GROUP)) {
      return {
        email: currentUser.email,
        isAdmin: true,
        status: ContactStatus.Active,
      };
    } else if (groupNames.includes(CUSTOMER_USER_GROUP) || groupNames.includes(PERSON_USER_GROUP)) {
      const accountResponse = await accountService.findAccountByAccountId(salesforceId);

      const orders = await salesforceOrderService.findAllOrders(salesforceId);
      const trialOrder = await salesforceOrderService.findTrailOrder(salesforceId, [
        OrderStatus.PendingApproval,
        OrderStatus.OnHold,
      ]);

      const order = await salesforceOrderService.findSingleOrder(salesforceId);

      let physician;
      if (order && order.physician) {
        physician = await accountService.findPhysicianDetail(order.physician);
      }

      const addonOrders = await salesforceAddonService.findUserAddonOrders(salesforceId);

      const hasOrder = !!orders.length;
      return {
        ...(getCamelCasedObject(accountResponse) as ICustomerInformation),
        hasOrder,
        physician: physician ? physician.name : '',
        addons: addonOrders,
        trialOrderStatus: trialOrder ? trialOrder.status : '',
      };
    }
    const leadResponse = await leadService.findLeadById(salesforceId);

    return {
      ...leadResponse,
      leadId: leadResponse.id,
      hasOrder: false,
      trialOrderStatus: '',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const saveReassessment = async (accountId: string, reassessmentDTO: IReassesmentDTO) => {
  try {
    const recordTypeRecords = await accountService.getRecordType(RECURRING_ASSESSMENT);

    const recordType = compose<typeof recordTypeRecords, any, IAssessmentRecordType>(
      head,
      getRecords
    )(recordTypeRecords);

    const recordTypeId = recordType.Id;

    const reassessment = reassessmentDTOtoSalesforceParams(reassessmentDTO);

    const accountResponse = await salesforceAssessmentService.saveReassessment(accountId, reassessment, recordTypeId);

    const imageUploadResponse = await salesforceDocumentService.linkMultipleDocuments({
      accountId,
      documentIds: reassessmentDTO.selfies,
    });

    return {
      ...accountResponse,
      selfies: imageUploadResponse,
    };
  } catch (error) {
    throw error;
  }
};

export const getAssessment = async (accountId: string) => {
  try {
    const response = await salesforceAssessmentService.getAsessmentDetail(accountId);

    return { response };
  } catch (error) {
    throw error;
  }
};

export const updateBillingAndShippingAddress = async attributes => {
  try {
    const accountData = await accountService.findByEmail(attributes.content.customer.email);

    const accountId = accountData.Id || '';
    const { customer, subscription = {} } = attributes.content;

    const response = await accountService.updateBillingAndShipping(accountId, {
      billingAddress: customer.billing_address || null,
      shippingAddress: subscription.shipping_address || null,
    });

    return response;
  } catch (err) {
    throw new Error(err);
  }
};
export const createCustomerCase = async ({
  description,
  selfies,
  accountId,
}: {
  description: string;
  selfies?: string[];
  accountId: string;
}): Promise<{ caseResponse: RecordResult; selfiesResponse: RecordResult[] }> => {
  try {
    const caseResponse = await caseService.createCase({ description, accountId });

    let selfiesResponse: RecordResult[] = [];

    if (selfies?.length) {
      selfiesResponse = await salesforceDocumentService.linkMultipleDocuments({
        accountId,
        documentIds: selfies,
      });
    }

    return {
      caseResponse,
      selfiesResponse,
    };
  } catch (error) {
    throw error;
  }
};

export const getOrderReviewDetails = async (accountId: string) => {
  const logger: winston.Logger = container.resolve('logger');
  try {
    const order = await salesforceOrderService.findTrailOrder(accountId, [
      OrderStatus.PendingApproval,
      OrderStatus.OnHold,
    ]);

    const { skinConditions } = await userAccountService.getAccountDetails(accountId);

    if (!order?.id) {
      throw new APIError('No pending approval or on hold order found.');
    }

    const orderItems = await salesforceOrderItemService.findOrderItemsByOrderId(order.id);

    const firstOrderItem = head(orderItems);

    logger.info(`Latest order successfully fetched for ${accountId}`);

    const orderReviewDetails = {
      productName: firstOrderItem?.fullName,
      ...compose<typeof order, IDetailedPlan, IDetailedPlan>(
        pick([
          'status',
          'id',
          'aTPWhatarewetreating',
          'aTPYourRX',
          'aTPLetsgetstarted',
          'aTPLifestylefactorstoconsider',
          'effectiveDate',
          'endDate',
          'aTPWhenToUseYourDocent',
          'aTPApplication',
          'aTPDosandDonts',
          'aTPGoodtoKnows',
          'aTPWhentouseyourDocentRich',
          'aTPYourWash',
          'aTPYourOralMedication',
          'aTPYourSpotTreatment',
        ]),
        getCamelCasedObject
      )(order),
      goals: getIndividualGoals(order),
    };

    const groupedOrderItems = {};
    const mappedOrderItems = [{}];

    orderItems.forEach(item => {
      const key = camelize(item['productFamily']);
      if (!(key in groupedOrderItems)) {
        groupedOrderItems[key] = [];
      }
      groupedOrderItems[key].push(item);
    });

    for (const key in groupedOrderItems) {
      mappedOrderItems.push({
        startDate: orderReviewDetails.effectiveDate,
        endDate: orderReviewDetails.endDate,
        productFamily: key as string,
        products: groupedOrderItems[key],
      });
    }

    return {
      skinConditions,
      orderReviewDetails,
      orderItems: mappedOrderItems,
    };
  } catch (error) {
    logger.error(error);
    throw new Error(error.message);
  }
};

export const declineOrder = async ({
  orderId,
  description,
  accountId,
}: {
  orderId: string;
  description: string;
  accountId: string;
}) => {
  const order = await salesforceOrderService.findOrderById(orderId);
  if (order && order.status === OrderStatus.PendingApproval) {
    await Promise.all([
      salesforceOrderService.updateOrder({ id: orderId, status: OrderStatus.OnHold }),
      salesforceCaseService.createCase({
        description,
        accountId,
      }),
    ]);
  } else {
    throw new NotFoundException(`Order with status ${OrderStatus.OnHold} with Id ${orderId} not found`);
  }
};

export const approveOrder = async (orderId: string) => {
  try {
    const res = await salesforceOrderService.approveOrder(orderId);
    if (!res.success) {
      throw new APIError(lang.orderUpdateFailed);
    }
    return {
      message: lang.approvedOrder,
    };
  } catch (error) {
    throw error;
  }
};

export const update = async (user: IUser, details: { email: string }) => {
  const logger: winston.Logger = container.resolve('logger');
  const chargebeeReferenceId = user.chargebeeReferenceId;
  const salesforceReferenceId = user.salesforceReferenceId;
  try {
    const userService = userServiceFactory();
    const existingUser = await userService.getCognitoUserInPoolByEmail(details.email);

    if (existingUser) {
      throw new AlreadyExistsException(COGNITO_USER, 'User already exists');
    }
    const userDetails = details;
    const attributes = toSnakeCaseAttrNameValuePairs({
      ...userDetails,
      ...(details.email ? { emailVerified: true } : null),
    });
    await Promise.all([
      chargebeeService.update(chargebeeReferenceId, details),
      accountService.updateAccount({
        accountId: salesforceReferenceId,
        email: details.email,
      }),
    ]);
    const result = await userService.updateCognitoUserInPool(user.email, attributes);
    return result;
  } catch (error) {
    logger.error(`Error when updating email to ${details.email}, reverting back to ${user.email}`);
    await Promise.all([
      chargebeeService.update(chargebeeReferenceId, { email: user.email }),
      accountService.updateAccount({
        accountId: salesforceReferenceId,
        email: user.email,
      }),
    ]);
    throw error;
  }
};

export const changePassword = async details => {
  try {
    const userService = userServiceFactory();
    return await userService.changePassword({
      accessToken: details.accessToken,
      previousPassword: details.oldPassword,
      proposedPassword: details.newPassword,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllAddonOrder = async () => {
  try {
    const groupedData = {};
    const addonOrders = await addonService.findAddonOrders();
    const addonIds = addonOrders.map(({ id }) => id);

    // fetch images for products
    const images = await salesforceDocumentService.findAddonImages(addonIds);

    // map images to addon orders
    for (let index = 0; index < addonOrders.length; index++) {
      for (const image of images) {
        if (addonOrders[index]['id'] === image['firstPublishLocationId']) {
          const { id, contentDocumentId, createdDate, srcUrl } = image;
          addonOrders[index]['photos'] = { id, createdDate, srcUrl, contentDocumentId };
        }
      }
    }

    // group addon orders based on product family
    addonOrders.forEach(item => {
      if (!((item['productCategory'] as string) in groupedData)) {
        groupedData[item['productCategory']] = [];
      }
      groupedData[item['productCategory']].push(item);
    });

    return groupedData;
  } catch (err) {
    throw err;
  }
};
/**
 *
 * @param addonId[]: Addon Order Record Ids
 * @param customerId
 * @returns
 */
export const deleteAddon = async (addonId: string[], chargebeeId: string, salesforceId: string) => {
  const addonData = await addonService.findUserAddonOrders(salesforceId);
  if (!addonData) {
    throw new OperationException(['No Addon Order Found!'], ADD_ON_ORDER, READ_OPERATION);
  }
  const results = await Promise.allSettled([addonService.deleteAddOnOrders(addonId)]);
  const [deleteAddonResult] = results;
  if (deleteAddonResult.status === PROMISE_FULFILLED) {
    const subData = await chargebeeSubscriptionService.retrieveSubscriptionForCustomer(chargebeeId);
    const [subscriptionUpdateResult] = await Promise.allSettled([
      chargebeeSubscriptionService.updateAddonOnSubscription(subData.subscription.id, {
        addons: [],
        end_of_term: true,
        replace_addon_list: true,
      }),
    ]);
    if (subscriptionUpdateResult.status == PROMISE_REJECTED) {
      /**
       * Rolling back the operations.
       */
      await Promise.allSettled([addonService.createAddOnOrders(salesforceId, addonId)]);

      console.log(subscriptionUpdateResult);
      throw new OperationException([subscriptionUpdateResult.reason.message], ADD_ON_ORDER, UPDATE_OPERATION);
    }

    return {
      addonId,
    };
  } else {
    throw new OperationException([deleteAddonResult.reason.message], ADD_ON_ORDER, DELETE_OPERATION);
  }
};
/**
 *
 * @param addonIds: Product Configuration Ids
 * @param salesforceReferenceId
 * @param chargebeeReferenceId
 * @returns: addonIds
 */
export const addAddon = async (addonIds: string[], salesforceReferenceId: string, chargebeeReferenceId: string) => {
  const results = await Promise.allSettled([addonService.createAddOnOrders(salesforceReferenceId, addonIds)]);
  const [addOrderResult] = results;
  if (addOrderResult.status == PROMISE_FULFILLED) {
    const subData = await chargebeeSubscriptionService.retrieveSubscriptionForCustomer(chargebeeReferenceId);
    console.log(subData);
    if (subData?.subscription?.hasScheduledChanges) {
      await chargebeeSubscriptionService.deleteScheduledChanges(subData.subscription.id);
    }
    const [chargebeeResult] = await Promise.allSettled([
      chargebeeSubscriptionService.incurChargeOnSubscription(chargebeeReferenceId, ''),
    ]);
    if (chargebeeResult.status == PROMISE_REJECTED) {
      const ids = addOrderResult.value.map(({ id }) => id);
      await Promise.allSettled([addonService.deleteAddOnOrders(ids)]);
      throw new OperationException([chargebeeResult.reason.message], ACCOUNT, CREATE_OPERATION);
    }
    return {
      addOrderResult,
    };
  } else {
    throw new OperationException([addOrderResult.reason.message], ACCOUNT, CREATE_OPERATION);
  }
};

export const updateName = async (
  email: string,
  referenceId: string,
  details: { firstName: string; lastName: string }
) => {
  const userService = userServiceFactory();

  const attributes = toSnakeCaseAttrNameValuePairs({
    givenName: details.firstName,
    familyName: details.lastName,
  });

  const userDetails = await userService.getCognitoUserInPoolByEmail(email);

  if (!userDetails) {
    throw new NotFoundException('Cognito User not found');
  }

  const results = await Promise.allSettled([
    leadService.updateLead({
      id: referenceId,
      leadDetails: {
        ...details,
        status: LeadStatus.Complete,
      },
    }),
    userService.updateCognitoUserInPool(email, attributes),
  ]);

  const hasFailed = !!results.filter(result => result.status === PROMISE_REJECTED).length;

  if (hasFailed) {
    const previousName = {
      firstName: '',
      lastName: '',
    };
    userDetails.UserAttributes?.reduce((accumulator, { Name, Value }) => {
      if (Name === COGNITO_USER_FIRST_NAME) {
        accumulator.firstName = Value || '';
      } else if (Name === COGNITO_USER_LAST_NAME) {
        accumulator.lastName = Value || '';
      }
      return accumulator;
    }, previousName);
    const [updateLeadResult, updateCognitoUserInPoolResult] = results;

    const rollbacks: Promise<SuccessResult | AdminUpdateUserAttributesCommandOutput>[] = [];

    if (updateLeadResult.status === PROMISE_FULFILLED) {
      rollbacks.push(leadService.updateLead({ id: referenceId, leadDetails: previousName }));
    }

    if (updateCognitoUserInPoolResult.status === PROMISE_FULFILLED) {
      const previousAttributes = toSnakeCaseAttrNameValuePairs({
        givenName: details.firstName,
        familyName: details.lastName,
      });
      rollbacks.push(userService.updateCognitoUserInPool(email, previousAttributes));
    }

    await Promise.all(rollbacks);

    if (updateLeadResult.status === PROMISE_REJECTED) {
      throw new OperationException([updateLeadResult.reason.message], LEAD, UPDATE_OPERATION);
    }
    if (updateCognitoUserInPoolResult.status === PROMISE_REJECTED) {
      throw new OperationException([updateCognitoUserInPoolResult.reason.message], COGNITO_USER, UPDATE_OPERATION);
    }
  }
  return {
    id: referenceId,
    ...details,
  };
};

export const addReview = async (
  accountId: string,
  review: { yourExperience: string; rating: number; recommend: boolean; picture: string[] }
) => {
  const results = await Promise.allSettled([createReview(accountId, review)]);
  const [addReviewResult]: [{ status: string; value?: { id: string } }] = results;

  let pictureResponse: RecordResult[] = [];

  if (review.picture?.length && addReviewResult.value) {
    pictureResponse = await salesforceDocumentService.linkMultipleDocuments({
      accountId: addReviewResult.value.id,
      documentIds: review.picture,
    });
  }

  return {
    addReviewResult,
    pictureResponse,
  };
};

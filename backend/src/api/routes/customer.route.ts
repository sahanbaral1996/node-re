import { Router } from 'express';

import {
  customerValidation,
  createCustomer,
  changeEmail,
  changePassword,
  changeName,
} from 'api/validators/customer.validator';

import isAuthorized from 'api/middlewares/authorization';

import * as assessmentService from 'api/controllers/assessment.controller';
import * as customerController from 'api/controllers/customer.controller';
import * as skinConditionController from 'api/controllers/skinCondition.controller';
import * as planController from 'api/controllers/plan.controller';
import * as validationController from 'api/controllers/validation.controller';
import * as subscriptionController from 'api/controllers/subscription.controller';

import authentication from 'api/middlewares/authentication';

import { celebrate, Segments } from 'celebrate';
import { reassessmentValidator } from 'api/validators/assessment.validator';
import { caseValidator, webToCaseValidator } from 'api/validators/case.validator';
import { createSubscriptionValidator, estimateSubscriptionValidator } from 'api/validators/subscription.validator';

const privateCustomerRouter = Router();
const publicCustomerRouter = Router();

export default (app: Router) => {
  app.use('/customers', publicCustomerRouter);

  app.use('/customers', authentication, privateCustomerRouter);

  publicCustomerRouter.get(
    '/validation',
    celebrate({ [Segments.QUERY]: customerValidation }),
    validationController.validateCustomer
  );

  privateCustomerRouter.post(
    '/reassessment',
    celebrate({
      [Segments.BODY]: reassessmentValidator,
    }),
    customerController.userReassessment
  );

  publicCustomerRouter.post('/', celebrate({ [Segments.BODY]: createCustomer }), customerController.createCustomer);

  privateCustomerRouter.get('/profile', customerController.getCustomerInformation);

  privateCustomerRouter.post(
    '/case',
    celebrate({ [Segments.BODY]: webToCaseValidator }),
    customerController.createCase
  );

  privateCustomerRouter.get('/order-review', authentication, customerController.orderReviewDetails);

  privateCustomerRouter.post('/order-review-approve/:orderId', customerController.approveOrder);

  privateCustomerRouter.get('/skin-condition-details', skinConditionController.getDetails);

  publicCustomerRouter.get('/addon-orders', customerController.getAllAddonOrder);

  privateCustomerRouter.patch(
    '/order-review/:orderId',
    celebrate({ [Segments.BODY]: caseValidator }),
    customerController.declineOrder
  );

  privateCustomerRouter.put('/', celebrate({ [Segments.BODY]: changeEmail }), customerController.updateUser);

  privateCustomerRouter.put(
    '/password',
    celebrate({ [Segments.BODY]: changePassword }),
    customerController.updatePassword
  );

  privateCustomerRouter.get('/:customerId/plans', isAuthorized, planController.get);

  privateCustomerRouter.post(
    '/:customerId/subscription',
    isAuthorized,
    celebrate({ [Segments.BODY]: createSubscriptionValidator }),
    subscriptionController.create
  );

  privateCustomerRouter.get('/retreive-subscription', subscriptionController.retreive);

  privateCustomerRouter.get('/assessment', customerController.getUserAssessment);

  privateCustomerRouter.put(
    '/:customerId/name',
    isAuthorized,
    celebrate({ [Segments.BODY]: changeName }),
    customerController.updateName
  );

  privateCustomerRouter.post(
    '/:customerId/subscription/estimates',
    isAuthorized,
    celebrate({ [Segments.BODY]: estimateSubscriptionValidator }),
    subscriptionController.estimate
  );

  privateCustomerRouter.post('/:customerId/assessment', isAuthorized, assessmentService.createAssessment);
  privateCustomerRouter.post('/:customerId/addonOrder/delete', isAuthorized, customerController.deleteAddon);
  privateCustomerRouter.post('/:customerId/addonOrder', isAuthorized, customerController.addAddon);
  privateCustomerRouter.post('/:customerId/review', isAuthorized, customerController.addReview);
};

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_validator_1 = require("api/validators/customer.validator");
const authorization_1 = __importDefault(require("api/middlewares/authorization"));
const assessmentService = __importStar(require("api/controllers/assessment.controller"));
const customerController = __importStar(require("api/controllers/customer.controller"));
const skinConditionController = __importStar(require("api/controllers/skinCondition.controller"));
const planController = __importStar(require("api/controllers/plan.controller"));
const validationController = __importStar(require("api/controllers/validation.controller"));
const subscriptionController = __importStar(require("api/controllers/subscription.controller"));
const authentication_1 = __importDefault(require("api/middlewares/authentication"));
const celebrate_1 = require("celebrate");
const assessment_validator_1 = require("api/validators/assessment.validator");
const case_validator_1 = require("api/validators/case.validator");
const subscription_validator_1 = require("api/validators/subscription.validator");
const privateCustomerRouter = express_1.Router();
const publicCustomerRouter = express_1.Router();
exports.default = (app) => {
    app.use('/customers', publicCustomerRouter);
    app.use('/customers', authentication_1.default, privateCustomerRouter);
    publicCustomerRouter.get('/validation', celebrate_1.celebrate({ [celebrate_1.Segments.QUERY]: customer_validator_1.customerValidation }), validationController.validateCustomer);
    privateCustomerRouter.post('/reassessment', celebrate_1.celebrate({
        [celebrate_1.Segments.BODY]: assessment_validator_1.reassessmentValidator,
    }), customerController.userReassessment);
    publicCustomerRouter.post('/', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: customer_validator_1.createCustomer }), customerController.createCustomer);
    privateCustomerRouter.get('/profile', customerController.getCustomerInformation);
    privateCustomerRouter.post('/case', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: case_validator_1.webToCaseValidator }), customerController.createCase);
    privateCustomerRouter.get('/order-review', authentication_1.default, customerController.orderReviewDetails);
    privateCustomerRouter.post('/order-review-approve/:orderId', customerController.approveOrder);
    privateCustomerRouter.get('/skin-condition-details', skinConditionController.getDetails);
    publicCustomerRouter.get('/addon-orders', customerController.getAllAddonOrder);
    privateCustomerRouter.patch('/order-review/:orderId', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: case_validator_1.caseValidator }), customerController.declineOrder);
    privateCustomerRouter.put('/', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: customer_validator_1.changeEmail }), customerController.updateUser);
    privateCustomerRouter.put('/password', celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: customer_validator_1.changePassword }), customerController.updatePassword);
    privateCustomerRouter.get('/:customerId/plans', authorization_1.default, planController.get);
    privateCustomerRouter.post('/:customerId/subscription', authorization_1.default, celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: subscription_validator_1.createSubscriptionValidator }), subscriptionController.create);
    privateCustomerRouter.get('/retreive-subscription', subscriptionController.retreive);
    privateCustomerRouter.get('/assessment', customerController.getUserAssessment);
    privateCustomerRouter.put('/:customerId/name', authorization_1.default, celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: customer_validator_1.changeName }), customerController.updateName);
    privateCustomerRouter.post('/:customerId/subscription/estimates', authorization_1.default, celebrate_1.celebrate({ [celebrate_1.Segments.BODY]: subscription_validator_1.estimateSubscriptionValidator }), subscriptionController.estimate);
    privateCustomerRouter.post('/:customerId/assessment', authorization_1.default, assessmentService.createAssessment);
    privateCustomerRouter.post('/:customerId/addonOrder/delete', authorization_1.default, customerController.deleteAddon);
    privateCustomerRouter.post('/:customerId/addonOrder', authorization_1.default, customerController.addAddon);
    privateCustomerRouter.post('/:customerId/review', authorization_1.default, customerController.addReview);
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveCustomerByEmail = exports.updateBillingInformation = exports.deleteCustomer = exports.update = exports.getHostedPortal = exports.getHostedPage = exports.getCustomer = exports.create = void 0;
const container_1 = __importDefault(require("container"));
const object_1 = require("utils/object");
const app_constants_1 = require("constants/app.constants");
const SubscriptionException_1 = __importDefault(require("api/exceptions/SubscriptionException"));
const callback_1 = require("utils/callback");
/**
 * Create Customer
 *
 * @param {firstName} string
 * @param {lastName} string
 * @param {email} string
 */
const create = async ({ firstName, lastName, email, }) => {
    const logger = container_1.default.resolve(app_constants_1.LOGGER_TOKEN);
    const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
    return new Promise((resolve, reject) => {
        chargebee.customer
            .create({
            first_name: firstName,
            last_name: lastName,
            email: email,
        })
            .request(function (error, result) {
            if (error) {
                logger.error(error);
                reject(error);
            }
            else {
                logger.info(`Created chargebee customer: ${result.customer.id}`);
                resolve(result);
            }
        });
    });
};
exports.create = create;
/**
 * Get Customer data from chargebee
 *
 * @param {customerId} string
 */
const getCustomer = async (customerId) => {
    const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
    return new Promise((resolve, reject) => {
        chargebee.customer.retrieve(customerId).request(function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.getCustomer = getCustomer;
/**
 * Create Customer
 *
 * @param {planId} string
 * @param {customerId} string
 */
const getHostedPage = async (planId, customerId) => {
    const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
    return new Promise((resolve, reject) => {
        chargebee.hosted_page
            .checkout_new({
            subscription: {
                plan_id: planId,
            },
            customer: {
                id: customerId,
            },
        })
            .request(function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.getHostedPage = getHostedPage;
/**
 * Create Customer
 *
 * @param {customerId} string
 */
const getHostedPortal = async (customerId) => {
    const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
    return new Promise((resolve, reject) => {
        chargebee.portal_session
            .create({
            customer: {
                id: customerId,
            },
        })
            .request(function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.getHostedPortal = getHostedPortal;
const update = async (customerId, details) => {
    const logger = container_1.default.resolve(app_constants_1.LOGGER_TOKEN);
    const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
    const params = object_1.toSnakeCaseAttrs(details);
    return new Promise((resolve, reject) => {
        chargebee.customer.update(customerId, params).request(function (error, result) {
            if (error) {
                logger.error(error);
                reject(error);
            }
            else {
                logger.info(`Update chargebee customer: ${customerId}`);
                resolve(result);
            }
        });
    });
};
exports.update = update;
/**
 * Delete Customer
 *
 * @param {customerId} string
 */
const deleteCustomer = async (customerId) => {
    const logger = container_1.default.resolve(app_constants_1.LOGGER_TOKEN);
    const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
    return new Promise((resolve, reject) => {
        chargebee.customer.delete(customerId).request(function (error, result) {
            if (error) {
                logger.error(error);
                reject(error);
            }
            else {
                logger.info(`Deleted chargebee customer: ${customerId}`);
                resolve(result);
            }
        });
    });
};
exports.deleteCustomer = deleteCustomer;
const updateBillingInformation = async (customerId, details) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const params = {
            billing_address: {
                line1: details.lineOne,
                line2: details.lineTwo,
                city: details.city,
                state: details.state,
                zip: details.zip,
                country: details.country,
            },
        };
        const requestWrapper = chargebee.customer.update_billing_info(customerId, params);
        const response = await requestWrapper.request(callback_1.noop);
        return JSON.parse(response.toString());
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.updateBillingInformation = updateBillingInformation;
const retrieveCustomerByEmail = async (email) => {
    try {
        const chargebee = container_1.default.resolve(app_constants_1.CHARGEBEE_TOKEN);
        const params = {
            email: {
                is: email,
            },
        };
        const requestWrapper = chargebee.customer.list(params);
        const response = await requestWrapper.request(callback_1.noop);
        const [result] = response.list;
        if (result) {
            const customerResponse = object_1.toCamelKeys(JSON.parse(result.toString()));
            return customerResponse;
        }
        return result;
    }
    catch (error) {
        throw new SubscriptionException_1.default(error.message, error.http_status_code, error);
    }
};
exports.retrieveCustomerByEmail = retrieveCustomerByEmail;

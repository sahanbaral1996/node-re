"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSingleOrder = exports.approveOrder = exports.findPublishedOrderNearTodayForAccountId = exports.updateOrder = exports.findOrderById = exports.findTrailOrder = exports.findAllOrdersTillDate = exports.findAllOrders = exports.findOrdersInRange = void 0;
const date_fns_1 = require("date-fns");
const jsforce_1 = require("jsforce");
const container_1 = __importDefault(require("container"));
const order_types_1 = require("types/salesforce/order.types");
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const ramda_1 = require("ramda");
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const OperationException_1 = __importDefault(require("api/exceptions/OperationException"));
/**
 *
 * @param {Number} arg.accountId
 * @param {Number} arg.startDate
 * @param {Number} arg.endDate
 */
const findOrdersInRange = async ({ accountId, startDate, endDate }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const formattedStartDate = date_fns_1.format(Number.parseInt(startDate, 10), 'yyyy-MM-dd');
    const formattedEndDate = date_fns_1.format(Number.parseInt(endDate, 10), 'yyyy-MM-dd');
    const response = await salesforceConnection
        .sobject(common_constants_1.ORDER)
        .find({
        'Account.ID': accountId,
        $or: [
            {
                $and: [
                    {
                        EffectiveDate: {
                            $gte: jsforce_1.SfDate.toDateLiteral(formattedStartDate),
                        },
                    },
                    {
                        EffectiveDate: {
                            $lte: jsforce_1.SfDate.toDateLiteral(formattedEndDate),
                        },
                    },
                ],
            },
            {
                $and: [
                    {
                        EndDate: {
                            $gte: jsforce_1.SfDate.toDateLiteral(formattedStartDate),
                        },
                    },
                    {
                        EndDate: {
                            $lte: jsforce_1.SfDate.toDateLiteral(formattedEndDate),
                        },
                    },
                ],
            },
        ],
        Published_to_Docent__c: true,
    })
        .sort({ EffectiveDate: 1 })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findOrdersInRange = findOrdersInRange;
/**
 *
 * @param {Number} accountId
 */
const findAllOrders = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection
        .sobject(common_constants_1.ORDER)
        .find({
        'Account.ID': accountId,
        Published_to_Docent__c: true,
    })
        .sort({ EffectiveDate: 1 })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findAllOrders = findAllOrders;
/**
 *
 * @param {Number} accountId
 */
const findAllOrdersTillDate = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const today = date_fns_1.format(new Date(), 'yyyy-MM-dd');
    const response = await salesforceConnection
        .sobject('Order')
        .find({
        'Account.ID': accountId,
        Published_to_Docent__c: true,
        EffectiveDate: { $lte: jsforce_1.SfDate.toDateLiteral(today) },
    })
        .sort({ EffectiveDate: -1 })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findAllOrdersTillDate = findAllOrdersTillDate;
/**
 *
 * @param {String} accountId
 */
const findTrailOrder = async (accountId, apiName) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection
        .sobject(common_constants_1.ORDER)
        .findOne({
        'Account.ID': accountId,
        Status: { $in: apiName },
        Type: order_types_1.OrderTypes.Trial,
    })
        .execute();
    return salesforce_helpers_1.getCamelCasedObject(response);
};
exports.findTrailOrder = findTrailOrder;
const findOrderById = async (orderId) => {
    try {
        const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
        const response = await salesforceConnection.sobject(common_constants_1.ORDER).retrieve(orderId);
        return salesforce_helpers_1.getCamelCasedObject(response);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.findOrderById = findOrderById;
const updateOrder = async (orderDetails) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ORDER).update({
        Id: orderDetails.id,
        Status: orderDetails.status,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ORDER, common_constants_1.UPDATE_OPERATION);
    }
    return response;
};
exports.updateOrder = updateOrder;
const findPublishedOrderNearTodayForAccountId = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const today = date_fns_1.format(new Date(), 'yyyy-MM-dd');
    const response = await salesforceConnection
        .sobject(common_constants_1.ORDER)
        .find({
        'Account.ID': accountId,
        Published_to_Docent__c: true,
        EffectiveDate: { $gte: jsforce_1.SfDate.toDateLiteral(today) },
        Status: order_types_1.OrderStatus.ShipmentsScheduled,
    })
        .sort({ EffectiveDate: 1 })
        .limit(1);
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findPublishedOrderNearTodayForAccountId = findPublishedOrderNearTodayForAccountId;
const approveOrder = async (orderId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection.sobject(common_constants_1.ORDER).update({
        Id: orderId,
        Patient_Approved__c: true,
    });
    if (!response.success) {
        throw new OperationException_1.default(response.errors, common_constants_1.ORDER, common_constants_1.UPDATE_OPERATION);
    }
    return response;
};
exports.approveOrder = approveOrder;
/**
 *
 * @param {String} accountId
 */
const findSingleOrder = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const order = await salesforceConnection
        .sobject(common_constants_1.ORDER)
        .find({
        'Account.ID': accountId,
        Published_to_Docent__c: true,
    })
        .sort({ EffectiveDate: -1 })
        .limit(1);
    return salesforce_helpers_1.getCamelCasedObject(ramda_1.head(order));
};
exports.findSingleOrder = findSingleOrder;

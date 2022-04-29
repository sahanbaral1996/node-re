"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrderItemsByOrderId = exports.findAllOrderItems = exports.findOrderItemsInRange = void 0;
const date_fns_1 = require("date-fns");
const jsforce_1 = require("jsforce");
const container_1 = __importDefault(require("container"));
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const ramda_1 = require("ramda");
const app_constants_1 = require("constants/app.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
/**
 *
 * @param {Number} arg.accountId
 * @param {Number} arg.startDate
 * @param {Number} arg.endDate
 */
const findOrderItemsInRange = async ({ accountId, startDate, endDate }) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const formattedStartDate = date_fns_1.format(Number.parseInt(startDate, 10), 'yyyy-MM-dd');
    const formattedEndDate = date_fns_1.format(Number.parseInt(endDate, 10), 'yyyy-MM-dd');
    const response = await salesforceConnection
        .sobject(common_constants_1.ORDER_ITEM)
        .find({
        'Order.Account.ID': accountId,
        $or: [
            {
                $and: [
                    {
                        'Order.EffectiveDate': {
                            $gte: jsforce_1.SfDate.toDateLiteral(formattedStartDate),
                        },
                    },
                    {
                        'Order.EffectiveDate': {
                            $lte: jsforce_1.SfDate.toDateLiteral(formattedEndDate),
                        },
                    },
                ],
            },
            {
                $and: [
                    {
                        'Order.EndDate': {
                            $gte: jsforce_1.SfDate.toDateLiteral(formattedStartDate),
                        },
                    },
                    {
                        'Order.EndDate': {
                            $lte: jsforce_1.SfDate.toDateLiteral(formattedEndDate),
                        },
                    },
                ],
            },
        ],
        'Order.Published_to_Docent__c': true,
    }, { '*': 1, 'Order.EffectiveDate': 1, 'Order.EndDate': 1, 'Order.Status': 1 })
        .sort({ 'Order.EffectiveDate': 1 })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findOrderItemsInRange = findOrderItemsInRange;
/**
 *
 * @param {Number} accountId
 */
const findAllOrderItems = async (accountId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection
        .sobject(common_constants_1.ORDER_ITEM)
        .find({
        'Order.Account.ID': accountId,
        'Order.Published_to_Docent__c': true,
    }, { '*': 1, 'Order.EffectiveDate': 1, 'Order.EndDate': 1, 'Order.Status': 1 })
        .sort({ 'Order.EffectiveDate': 1 })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findAllOrderItems = findAllOrderItems;
const findOrderItemsByOrderId = async (orderId) => {
    const salesforceConnection = container_1.default.resolve(app_constants_1.SALESFORCE_TOKEN);
    const response = await salesforceConnection
        .sobject(common_constants_1.ORDER_ITEM)
        .find({
        'Order.ID': orderId,
    })
        .execute();
    return ramda_1.map(salesforce_helpers_1.getCamelCasedObject, response);
};
exports.findOrderItemsByOrderId = findOrderItemsByOrderId;

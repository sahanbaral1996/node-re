"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterLineItemsByEntityId = exports.filterLineItemsByEntityType = exports.formatEstimate = void 0;
const ramda_1 = require("ramda");
function formatEstimate(estimate) {
    const { amountDue, subTotal, total, lineItems, taxes } = estimate;
    const formattedResponse = { amountDue, subTotal, total, taxes, lineItems };
    const discount = ramda_1.head(estimate.discounts || []);
    if (discount) {
        formattedResponse.discountAmount = discount.amount;
        formattedResponse.description = discount.description;
        formattedResponse.discountDescription = discount.description;
    }
    return formattedResponse;
}
exports.formatEstimate = formatEstimate;
function filterLineItemsByEntityType(lineItems, entityType) {
    return lineItems.filter(lineItem => lineItem.entityType !== entityType);
}
exports.filterLineItemsByEntityType = filterLineItemsByEntityType;
function filterLineItemsByEntityId(lineItems, entityId) {
    return lineItems.filter(lineItem => lineItem.entityId !== entityId);
}
exports.filterLineItemsByEntityId = filterLineItemsByEntityId;

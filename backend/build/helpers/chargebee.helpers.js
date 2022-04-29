"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasLineItemWithEntityId = exports.getChargbeeAddOns = exports.getEventBasedAddOns = void 0;
const estimate_types_1 = require("types/chargebee/estimate.types");
function getEventBasedAddOns(ids) {
    const eventAddons = ids.map(id => ({
        id,
        charge_on: estimate_types_1.ChargeOnTypes.OnEvent,
        charge_once: true,
        on_event: estimate_types_1.AddOnChargeEvents.SubscriptionCreation,
    }));
    return eventAddons;
}
exports.getEventBasedAddOns = getEventBasedAddOns;
function getChargbeeAddOns(ids) {
    const addons = ids.map(id => ({ id }));
    return addons;
}
exports.getChargbeeAddOns = getChargbeeAddOns;
function hasLineItemWithEntityId(lineItems, entityId) {
    const lineItem = lineItems.find(item => item.entity_id === entityId);
    return !!lineItem;
}
exports.hasLineItemWithEntityId = hasLineItemWithEntityId;

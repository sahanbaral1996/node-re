"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItemEntityTypes = exports.ChargeOnTypes = exports.AddOnChargeEvents = void 0;
var AddOnChargeEvents;
(function (AddOnChargeEvents) {
    AddOnChargeEvents["SubscriptionCreation"] = "subscription_creation";
    AddOnChargeEvents["SubscriptionTrialStart"] = "subscription_trial_start";
})(AddOnChargeEvents = exports.AddOnChargeEvents || (exports.AddOnChargeEvents = {}));
var ChargeOnTypes;
(function (ChargeOnTypes) {
    ChargeOnTypes["Immediately"] = "immediately";
    ChargeOnTypes["OnEvent"] = "on_event";
})(ChargeOnTypes = exports.ChargeOnTypes || (exports.ChargeOnTypes = {}));
var LineItemEntityTypes;
(function (LineItemEntityTypes) {
    LineItemEntityTypes["Plan"] = "plan";
    LineItemEntityTypes["AddOn"] = "addon";
})(LineItemEntityTypes = exports.LineItemEntityTypes || (exports.LineItemEntityTypes = {}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.OrderTypes = void 0;
var OrderTypes;
(function (OrderTypes) {
    OrderTypes["Standard"] = "Standard";
    OrderTypes["Trial"] = "Trial";
})(OrderTypes = exports.OrderTypes || (exports.OrderTypes = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Draft"] = "Draft";
    OrderStatus["Published"] = "Published";
    OrderStatus["ShipmentsScheduled"] = "Shipments Scheduled";
    OrderStatus["Complete"] = "Complete";
    OrderStatus["Cancelled"] = "Cancelled";
    OrderStatus["OnHold"] = "On Hold";
    OrderStatus["PendingApproval"] = "Pending Approval";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));

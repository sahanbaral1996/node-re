"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutine = void 0;
var RegimentTime;
(function (RegimentTime) {
    RegimentTime["Anytime"] = "ANYTIME";
    RegimentTime["Morning"] = "MORNING";
    RegimentTime["Evening"] = "EVENING";
})(RegimentTime || (RegimentTime = {}));
const getRoutine = (regimentTime) => RegimentTime[regimentTime];
exports.getRoutine = getRoutine;

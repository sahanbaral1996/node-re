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
exports.createServerEvent = void 0;
const bizSdk = __importStar(require("facebook-nodejs-business-sdk"));
const config_1 = __importDefault(require("../../config"));
const analytics_constants_1 = require("constants/analytics.constants");
const createServerEvent = async (pixelPayload, remoteAddress, userAgent) => {
    const CustomData = bizSdk.CustomData;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;
    const ServerEvent = bizSdk.ServerEvent;
    const access_token = config_1.default.facebook.access_token;
    const pixel_id = config_1.default.facebook.pixel_id;
    bizSdk.FacebookAdsApi.init(access_token);
    const current_timestamp = Math.floor(new Date().valueOf() / 1000);
    const userData = new UserData()
        // It is recommended to send Client IP and User Agent for Conversions API Events.
        .setClientIpAddress(remoteAddress)
        .setClientUserAgent(userAgent);
    let serverEvent = new ServerEvent()
        .setEventName(pixelPayload.eventName)
        .setEventTime(current_timestamp)
        .setUserData(userData)
        .setEventSourceUrl(pixelPayload.eventSourceUrl);
    if (pixelPayload.eventName === analytics_constants_1.FB_PIXEL_PURCHASE) {
        const customData = new CustomData()
            .setCurrency(pixelPayload.customData?.currency)
            .setValue(pixelPayload.customData?.value);
        serverEvent = serverEvent.setCustomData(customData);
    }
    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(eventsData);
    return eventRequest.execute();
};
exports.createServerEvent = createServerEvent;

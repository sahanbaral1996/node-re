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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = void 0;
const salesforceOrderService = __importStar(require("./salesforce/order.service"));
const salesforceOrderItemService = __importStar(require("./salesforce/orderItem.service"));
const salesforceDocumentService = __importStar(require("./salesforce/document.service"));
const salesforce_helpers_1 = require("helpers/salesforce.helpers");
const document_constants_1 = require("constants/salesforce/document.constants");
const date_1 = require("utils/date");
const groupOrderItemsByOrderId = (orders, orderItems, contentVersions) => {
    const orderMap = new Map();
    orders.forEach(order => {
        const { effectiveDate, endDate, aTPWhentouseyourDocentRich, aTPApplication, aTPDosandDonts, aTPGoodtoKnows, status, aTPYourRX, aTPLifestylefactorstoconsider, aTPYourWash, aTPYourOralMedication, aTPYourSpotTreatment, } = order;
        orderMap.set(order.id, {
            goals: salesforce_helpers_1.getIndividualGoals(order),
            startDate: effectiveDate,
            endDate: endDate,
            photos: [],
            orderItems: [],
            aTPWhentouseyourDocentRich,
            aTPApplication,
            aTPDosandDonts,
            aTPGoodtoKnows,
            status,
            aTPYourRX,
            aTPLifestylefactorstoconsider,
            aTPYourWash,
            aTPYourOralMedication,
            aTPYourSpotTreatment,
        });
    });
    let contentVersionIndex = 0;
    for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
        const currentOrder = orderMap.get(orders[orderIndex].id);
        if (contentVersionIndex === contentVersions.length) {
            break;
        }
        if (currentOrder) {
            while (contentVersionIndex < contentVersions.length) {
                const currentContentVersion = contentVersions[contentVersionIndex];
                const orderStartDate = new Date(currentOrder.startDate);
                const orderEndDate = new Date(currentOrder.endDate);
                const contentVersionCreatedDate = new Date(currentContentVersion.createdDate);
                if (orderIndex === 0 && date_1.isBeforeDate(orderEndDate, contentVersionCreatedDate)) {
                    currentOrder.photos.push({
                        id: currentContentVersion.id,
                        srcUrl: currentContentVersion.srcUrl,
                        createdDate: currentContentVersion.createdDate,
                    });
                }
                else if (date_1.isBetweenDates(orderStartDate, orderEndDate, contentVersionCreatedDate)) {
                    currentOrder.photos.push({
                        id: currentContentVersion.id,
                        srcUrl: currentContentVersion.srcUrl,
                        createdDate: currentContentVersion.createdDate,
                    });
                }
                else {
                    break;
                }
                contentVersionIndex++;
            }
        }
    }
    orderItems.forEach(orderItem => {
        const order = orderMap.get(orderItem.orderId);
        const { morningEvening, fullName, productFamily, applicationInstructions } = orderItem;
        if (order) {
            order.orderItems.push({
                fullName,
                morningEvening,
                productFamily,
                applicationInstructions,
            });
        }
    });
    return orderMap;
};
const findAll = async (accountId) => {
    try {
        const [orders, orderItems, contentVersions] = await Promise.all([
            salesforceOrderService.findAllOrders(accountId),
            salesforceOrderItemService.findAllOrderItems(accountId),
            salesforceDocumentService.findAllContentVersions({ accountId, prefix: document_constants_1.SELFIE_PREFIX }),
        ]);
        return {
            plans: Array.from(groupOrderItemsByOrderId(orders, orderItems, contentVersions).values()),
        };
    }
    catch (error) {
        throw error;
    }
};
exports.findAll = findAll;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressInformation = exports.formatGenderIdentity = exports.formatMenstrualPeriodReason = exports.formatHasExplanation = exports.getIndividualSkinConditions = exports.reassessmentDTOtoSalesforceParams = exports.addPrefixToFiles = exports.getCamelCasedObject = exports.camelize = exports.isDateRangeDefined = exports.getInQuotes = exports.checkIfAllowedState = exports.getIndividualGoals = exports.lisAllowedState = exports.getRecords = void 0;
const assessment_constants_1 = require("constants/salesforce/assessment.constants");
const ramda_1 = require("ramda");
const assessment_types_1 = require("types/salesforce/assessment.types");
exports.getRecords = ramda_1.prop('records');
exports.lisAllowedState = [
    'Florida',
    'Texas',
    'Idaho',
    'Washington',
    'California',
    'Pennsylvania',
    'Georgia',
    'Colorado',
    'Michigan',
    'Minnesota',
    'Nevada',
    'Montana',
    'Arizona',
    'Hawaii',
    'Ohio',
    'New Jersey',
    'Utah',
    'Virginia',
    'North Carolina',
    'New York',
];
exports.getIndividualGoals = ramda_1.compose(ramda_1.values, ramda_1.filter(ramda_1.complement(ramda_1.isNil)), ramda_1.pick(['goal1', 'goal2', 'goal3']));
const checkIfAllowedState = (state) => {
    return state ? (exports.lisAllowedState.includes(state) ? true : false) : false;
};
exports.checkIfAllowedState = checkIfAllowedState;
const getInQuotes = (value) => `'${value}'`;
exports.getInQuotes = getInQuotes;
const isDateRangeDefined = (startDate, endDate) => startDate && endDate;
exports.isDateRangeDefined = isDateRangeDefined;
/**
 * camel case string
 *
 * @param {String} str
 */
const camelize = str => {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
        .replace(/\s+|_/g, '');
};
exports.camelize = camelize;
/**
 * change object keys to camelCase from salesforce query result
 *
 * @param {Object} obj
 */
const getCamelCasedObject = (obj) => {
    if (!obj) {
        return obj;
    }
    const newObj = {};
    Object.keys(obj).forEach(item => {
        const newKey = exports.camelize(item.replace(/__r|__pc|__c/g, ''));
        newObj[newKey] = obj[item];
    });
    return newObj;
};
exports.getCamelCasedObject = getCamelCasedObject;
exports.addPrefixToFiles = ramda_1.curry((prefix, { originalname, buffer }) => ({
    prefixedFileName: `${prefix}-${originalname}`,
    body: buffer.toString('base64'),
}));
const reassessmentDTOtoSalesforceParams = (reassessmentDTO) => {
    const hydroNotPrescribed = ramda_1.path(['hydroquinone', 'notCurrentlyPrescribed'], reassessmentDTO);
    const adjustedReassessment = {
        Skin_Response_to_Regimen__c: ramda_1.path(['skinResponseToCurrentRegimen'], reassessmentDTO),
        Redness_Irritation_or_Peeling__c: ramda_1.path(['rednessIrritationPeelingStatus'], reassessmentDTO),
        Redness_Irritation_or_Peeling_Rating__c: ramda_1.path(['rednessIrritationPeelingRating'], reassessmentDTO),
        Redness_Irritation_or_Peeling_Location__c: ramda_1.path(['rednessIrritationPeelingLocation'], reassessmentDTO),
        New_Meds_Since_Last_Assessment__c: ramda_1.path(['newMedication'], reassessmentDTO),
        New_Medication_Type__c: ramda_1.path(['newMedicationType'], reassessmentDTO),
        Current_Condition__c: ramda_1.path(['currentCondition'], reassessmentDTO),
        Pregnancy_Status__c: ramda_1.path(['pregnancyInThreeMonths'], reassessmentDTO),
        Darkening_of_Spots__c: ramda_1.path(['hydroquinone', 'darkeningOfSpots'], reassessmentDTO),
        Fishy_Taste_or_Smell__c: ramda_1.path(['hydroquinone', 'fishyTasteOrSmell'], reassessmentDTO),
        Orange_Discoloration__c: ramda_1.path(['hydroquinone', 'orangeDiscoloration'], reassessmentDTO),
        Not_Currently_Prescribed_Hydroquinone__c: hydroNotPrescribed === assessment_constants_1.YES ? true : false,
        Increased_Sun_Sensitivity__c: ramda_1.path(['retinoidsSideEffects', 'increasedSunSensitivity'], reassessmentDTO),
        Rash_or_Redness__c: ramda_1.path(['retinoidsSideEffects', 'rashRedness'], reassessmentDTO),
    };
    return adjustedReassessment;
};
exports.reassessmentDTOtoSalesforceParams = reassessmentDTOtoSalesforceParams;
const getIndividualSkinConditions = (skinConditions) => {
    if (!skinConditions) {
        return [];
    }
    const individualSkinConditions = skinConditions.split(',').map(item => assessment_types_1.ISkinConditions[item.trim()]) || [];
    return individualSkinConditions;
};
exports.getIndividualSkinConditions = getIndividualSkinConditions;
const formatHasExplanation = (input) => `${input.has}${input.explanation ? ` ${input.explanation}` : ''}`;
exports.formatHasExplanation = formatHasExplanation;
const formatMenstrualPeriodReason = (input) => {
    return input?.doesOccur === 'No' ? ` ${input.whyNot} ${input.whyNot === 'Other' ? input.explanation : ''}` : '';
};
exports.formatMenstrualPeriodReason = formatMenstrualPeriodReason;
const formatGenderIdentity = (input) => `${input.gender}${input.gender === 'Other' ? ` ${input.otherExplanation}` : ''}`;
exports.formatGenderIdentity = formatGenderIdentity;
const getAddressInformation = (address) => {
    const addressInformation = {
        street: undefined,
        city: undefined,
        postalCode: undefined,
        country: undefined,
        state: undefined,
    };
    if (address) {
        addressInformation.street = `${address.line1 || ''} ${address.line2 || ''}`;
        addressInformation.city = address.city;
        addressInformation.state = address.state;
        addressInformation.postalCode = address.zip;
    }
    return addressInformation;
};
exports.getAddressInformation = getAddressInformation;

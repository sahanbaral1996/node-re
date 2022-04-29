"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomer = void 0;
const AlreadyExistsException_1 = __importDefault(require("api/exceptions/AlreadyExistsException"));
const ConstraintViolationException_1 = __importDefault(require("api/exceptions/ConstraintViolationException"));
const cognito_constants_1 = require("constants/cognito.constants");
const customer_constants_1 = require("constants/customer.constants");
const common_constants_1 = require("constants/salesforce/common.constants");
const date_fns_1 = require("date-fns");
const user_service_1 = __importDefault(require("./cognito/user.service"));
const validateCustomer = async (input) => {
    if (input.dob) {
        const dob = date_fns_1.getUnixTime(new Date(input.dob));
        const cutoffDate = date_fns_1.getUnixTime(date_fns_1.subYears(new Date(), customer_constants_1.CUTOFF_YEARS));
        if (dob > cutoffDate) {
            throw new ConstraintViolationException_1.default(common_constants_1.ACCOUNT, 'Date of Birth is not eligible');
        }
    }
    if (input.email) {
        const email = input.email;
        const userService = user_service_1.default();
        const cognitoUser = await userService.getCognitoUserInPoolByEmail(email);
        if (cognitoUser) {
            throw new AlreadyExistsException_1.default(cognito_constants_1.COGNITO_USER, 'Email already exists');
        }
    }
    return;
};
exports.validateCustomer = validateCustomer;

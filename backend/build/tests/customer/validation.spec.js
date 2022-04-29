"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const http_status_codes_1 = require("http-status-codes");
const customer_constants_1 = require("constants/customer.constants");
const app_1 = __importDefault(require("app"));
const date_fns_1 = require("date-fns");
const API_URL = '/api/customers/validation';
describe('[Feature] Customer Validation - /api/customers/validation', function () {
    let app;
    this.beforeAll(async () => {
        app = await app_1.default;
        return app;
    });
    it('Validate eligible date of birth', () => {
        const eligibleDate = date_fns_1.subYears(new Date(), customer_constants_1.CUTOFF_YEARS);
        return supertest_1.default(app).get(API_URL).query({ dob: eligibleDate }).expect(http_status_codes_1.StatusCodes.OK);
    });
    it('Invalidate ineligible date of birth', () => {
        const inEligibleDate = date_fns_1.subYears(new Date(), customer_constants_1.CUTOFF_YEARS - 1);
        return supertest_1.default(app).get(API_URL).query({ dob: inEligibleDate }).expect(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE);
    });
    this.afterAll(() => {
        app.close();
    });
});

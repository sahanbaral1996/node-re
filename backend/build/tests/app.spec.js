"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const http_status_codes_1 = require("http-status-codes");
const chai_1 = require("chai");
const app_1 = __importDefault(require("app"));
describe('App', function () {
    let app;
    this.beforeAll(async () => {
        app = await app_1.default;
        return app;
    });
    it('should status api', function () {
        return supertest_1.default(app)
            .get('/status')
            .expect(http_status_codes_1.StatusCodes.OK)
            .then(({ body }) => {
            chai_1.expect(body).to.deep.equal({ success: true });
        });
    });
    this.afterAll(() => {
        app.close();
    });
});

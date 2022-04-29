import request from 'supertest';

import { StatusCodes } from 'http-status-codes';

import { CUTOFF_YEARS } from 'constants/customer.constants';

import server from 'app';
import { subYears } from 'date-fns';

const API_URL = '/api/customers/validation';

describe('[Feature] Customer Validation - /api/customers/validation', function () {
  let app;
  this.beforeAll(async () => {
    app = await server;
    return app;
  });

  it('Validate eligible date of birth', () => {
    const eligibleDate = subYears(new Date(), CUTOFF_YEARS);
    return request(app).get(API_URL).query({ dob: eligibleDate }).expect(StatusCodes.OK);
  });

  it('Invalidate ineligible date of birth', () => {
    const inEligibleDate = subYears(new Date(), CUTOFF_YEARS - 1);

    return request(app).get(API_URL).query({ dob: inEligibleDate }).expect(StatusCodes.NOT_ACCEPTABLE);
  });

  this.afterAll(() => {
    app.close();
  });
});

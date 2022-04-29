import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import { expect } from 'chai';

import server from 'app';

describe('App', function () {
  let app;
  this.beforeAll(async () => {
    app = await server;
    return app;
  });

  it('should status api', function () {
    return request(app)
      .get('/status')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).to.deep.equal({ success: true });
      });
  });

  this.afterAll(() => {
    app.close();
  });
});

// import request from 'supertest';

// import { StatusCodes } from 'http-status-codes';

// import { expect } from 'chai';

// import server from 'app';

// import lang from 'lang';

// const API_URL = '/api/leads';

// import * as leadService from 'services/salesforce/lead.service';

// describe('[Feature] Lead - /api/leads', function () {
//   const leadIdentity = {
//     email: 'test-lead@email.com',
//   };

//   let leadId = '';
//   let app;
//   this.beforeAll(async () => {
//     app = await server;
//     return app;
//   });

//   it('Create [POST /]', () => {
//     return request(app)
//       .post(API_URL)
//       .send(leadIdentity)
//       .expect(StatusCodes.OK)
//       .then(({ body }) => {
//         expect(body.message).to.equal(lang.leadCreated);
//         expect(body.data).to.have.a.property('id');
//         leadId = body.data.id;
//       });
//   });

//   this.afterAll(() => {
//     leadService.deleteLead(leadId);
//     app.close();
//   });
// });

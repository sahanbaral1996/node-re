import * as React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, screen, waitForElementToBeRemoved } from '../utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { ACCOUNT_DETAIL, PLAN } from 'constants/api';
import { differenceInDays, startOfDay } from 'date-fns';

import config from 'config';
import Home from 'components/home/Home';
import history from 'utils/history';
import { Router as BrowserRouter } from 'react-router-dom';
import { build, fake } from '@jackfranklin/test-data-bot';
import { HomeRouterContext } from 'components/home/Router';
import { UserStatus } from 'types/profile';

const detailResponseBuilder = build({
  fields: {
    code: 200,
    data: {
      assmtDaysUntilDue: 22,
      assmtNextDueDate: fake(faker => faker.date.future()),
      assmtLastCompleted: fake(faker => faker.date.past()),
      assmtActive: false,
      chiefComplaints: fake(faker => faker.random.word()),
      id: '1230ADHG3S',
      name: fake(faker => faker.name.findName()),
      skinConditions: ['acne'],
    },
  },
});
const treatmentPlanResponseBuilder = build({
  fields: {
    code: 200,
    data: {
      plans: [
        {
          aTPApplication:
            '<ul><li><span style="background-color: rgb(255, 255, 255); font-size: 12px; color: rgb(68, 68, 68);">In the evening, w</span><li></ul>',
          aTPDosandDonts: '<p><b>Do&#39;s &amp; Don&#39;ts</b></p><p></p>',
          aTPGoodtoKnows: '<p><b>Usage tips</b></p>',
          aTPLifestylefactorstoconsider: null,
          aTPWhentouseyourReveDocentRich:
            '<ul><li><span style="background-color: rgb(255, 255, 255); font-size: 12px; color: rgb(68, 68, 68);">Week 1 – Use 3 times per week.</span></li></ul>',
          aTPYourRX:
            '<p><br></p><p> </p><p><b style="color: rgb(68, 68, 68); font-size: 12px; background-color: rgb(255, 255, 255);">Niacinamide</b>M/p>',
          endDate: fake(faker => faker.date.future()),
          startDate: fake(faker => faker.date.past()),
          goals: [fake(faker => faker.random.word()), fake(faker => faker.random.word())],
          orderItems: [
            {
              morningEvening: 'Evening',
              fullName: 'Hydroquinone 4%, Kojic Acid 1%, Niacinamide 4%',
            },
          ],
          photos: [
            {
              createdDate: '2021-04-26T07:47:36.000+0000',
              id: fake(faker => faker.random.alphaNumeric()),
            },
          ],
          status: 'Shipments Scheduled',
        },
      ],
    },
  },
});

const detailResponseData: any = detailResponseBuilder();
const treatmentPlanResponseData: any = treatmentPlanResponseBuilder();

describe('Dashboard Component with context', () => {
  const server = setupServer(
    rest.get(`${config.baseURI}${ACCOUNT_DETAIL}`, (req, res, ctx) => {
      return res(ctx.json(detailResponseData));
    }),
    rest.get(`${config.baseURI}${PLAN}`, (req, res, ctx) => {
      return res(ctx.json(treatmentPlanResponseData));
    })
  );

  beforeEach(() => {
    render(
      <HomeRouterContext.Provider
        value={{
          state: {
            id: 'ASDF123',
            dOB: 'asd',
            hyperpigmentation: true,
            leadId: 'asd',
            status: UserStatus.ImageUploads,
            email: 'test@gmail.com',
            name: 'Test User',
            chargebeeId: '00123',
            salesforceId: '00123S',
            trialOrderStatus: '',
            hasOrder: false,
          },
          dispatch: () => {},
        }}
      >
        <BrowserRouter history={history}>
          <Home />
        </BrowserRouter>
      </HomeRouterContext.Provider>
    );
  });
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('Renders the required personalized solution component', async () => {
    await waitForElementToBeRemoved(() => screen.queryByTestId('button-loader'));

    expect(screen.getByText('Acne')).toBeInTheDocument();

    const { assmtNextDueDate } = detailResponseData.data;

    const today = startOfDay(new Date());
    const dateToCompare = startOfDay(new Date(assmtNextDueDate));
    const diff = differenceInDays(dateToCompare, today);

    const daysPostFix = diff > 1 ? 'days' : 'day';

    expect(screen.getByText(`${diff} ${daysPostFix}`)).toBeInTheDocument();
  });

  test('Renders the remaining treatment plan', async () => {
    await waitForElementToBeRemoved(() => screen.getByTestId('plan-loader'));
    expect(screen.getByRole('button', { name: /Contact us/i })).toBeInTheDocument();

    const { plans } = treatmentPlanResponseData.data;

    expect(screen.getByText(plans[0].goals[0])).toBeInTheDocument();
    expect(screen.getByText(plans[0].orderItems[0].morningEvening)).toBeInTheDocument();
    expect(screen.getByText(plans[0].orderItems[0].fullName)).toBeInTheDocument();
  });
});

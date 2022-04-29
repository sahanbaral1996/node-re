import * as React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Auth } from 'aws-amplify';
import '@testing-library/jest-dom/extend-expect';

import { fireEvent, render, screen } from 'utils/test-utils';
import { UPDATE_CUSTOMER } from 'constants/api';

import config from 'config';
import history from 'utils/history';
import { Router as BrowserRouter } from 'react-router-dom';
import { HomeRouterContext } from 'components/home/Router';
import { UserStatus } from 'types/profile';
import Email from 'components/myAccount/Email';

describe('Email change component', () => {
  const server = setupServer(
    rest.put(`${config.baseURI}${UPDATE_CUSTOMER}`, (req, res, ctx) => {
      return res(ctx.json({ data: { message: 'Email changed successfully.' } }));
    })
  );

  beforeEach(() => {
    render(
      <HomeRouterContext.Provider
        value={{
          state: {
            id: 'ASDF123',
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
          <Email />
        </BrowserRouter>
      </HomeRouterContext.Provider>
    );
  });
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('Renders the Update email properly.', () => {
    expect(screen.getByLabelText('New email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Current password')).toBeInTheDocument();
  });

  test('Validation works properly.', async () => {
    expect(screen.queryByText('Please provide new email address.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please provide your current password.')).not.toBeInTheDocument();
    const updateEmailBtn = screen.getByRole('button', { name: /Update email/i });

    fireEvent.click(updateEmailBtn);
    expect(await screen.findByText('Please provide new email address.')).toBeInTheDocument();
    expect(await screen.findByText('Please provide your current password.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('New email address'), {
      target: { value: 'testemail' },
    });
    fireEvent.click(updateEmailBtn);
    expect(await screen.findByText('Email must be a valid email.')).toBeInTheDocument();
  });

  test('Change email works properly.', async () => {
    const updateEmailBtn = screen.getByRole('button', { name: /Update email/i });

    fireEvent.change(screen.getByLabelText('New email address'), {
      target: { value: 'testemail@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Current password'), {
      target: { value: 'Testing123*' },
    });
    Auth.signIn = jest.fn().mockImplementation(() => {});
    fireEvent.click(updateEmailBtn);
    expect(await screen.findByText('Email changed successfully.')).toBeInTheDocument();
  });
});

import * as React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Auth } from 'aws-amplify';
import '@testing-library/jest-dom/extend-expect';

import { fireEvent, render, screen } from 'utils/test-utils';
import { UPDATE_PASSWORD } from 'constants/api';

import config from 'config';
import history from 'utils/history';
import { Router as BrowserRouter } from 'react-router-dom';
import { HomeRouterContext } from 'components/home/Router';
import { UserStatus } from 'types/profile';
import Password from 'components/myAccount/Password';

describe('Change password component', () => {
  const server = setupServer(
    rest.put(`${config.baseURI}${UPDATE_PASSWORD}`, (req, res, ctx) => {
      return res(ctx.json({ data: { message: 'Password changed successfully.' } }));
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
          <Password />
        </BrowserRouter>
      </HomeRouterContext.Provider>
    );
  });
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('Renders the change password component properly.', () => {
    expect(screen.getByLabelText('Current password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument();
  });

  test('Validation works properly.', async () => {
    expect(screen.queryByText('Please provide your current pasword.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please provide your new password.')).not.toBeInTheDocument();
    expect(screen.queryByText('Please confirm your new password.')).not.toBeInTheDocument();
    const changePwdBtn = screen.getByRole('button', { name: /Change password/i });

    fireEvent.click(changePwdBtn);
    expect(await screen.findByText('Please provide your current password.')).toBeInTheDocument();
    expect(await screen.findByText('Please provide your new password.')).toBeInTheDocument();
    expect(await screen.findByText('Please confirm your new password.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'testemail' },
    });
    fireEvent.click(changePwdBtn);
    expect(
      await screen.findByText(
        'New password must contain at least 8 characters, a number, a special character and at least one lowercase letter.'
      )
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'Testing123*' },
    });
    fireEvent.change(screen.getByLabelText('Confirm new password'), {
      target: { value: 'aTesting123*' },
    });
    fireEvent.click(changePwdBtn);
    expect(await screen.findByText('Confirm password must match the new password.')).toBeInTheDocument();
  });

  test('Change password works properly.', async () => {
    const changePwdBtn = screen.getByRole('button', { name: /Change password/i });

    fireEvent.change(screen.getByLabelText('Current password'), {
      target: { value: 'Test123*' },
    });
    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'Testing123*' },
    });
    fireEvent.change(screen.getByLabelText('Confirm new password'), {
      target: { value: 'Testing123*' },
    });
    Auth.signIn = jest.fn().mockImplementation(() => {});
    fireEvent.click(changePwdBtn);
    expect(await screen.findByText('Password changed successfully.')).toBeInTheDocument();
  });
});

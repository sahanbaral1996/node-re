import * as React from 'react';

import { fireEvent, render, screen, waitFor } from 'utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import * as routes from 'constants/routes';

import history from 'utils/history';
import { Router as BrowserRouter } from 'react-router-dom';
import { HomeRouterContext } from 'components/home/Router';
import { UserStatus } from 'types/profile';
import Account from 'components/myAccount/Account';

describe('Account component with context', () => {
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
          <Account />
        </BrowserRouter>
      </HomeRouterContext.Provider>
    );
  });

  test('Renders the account component properly.', () => {
    const topicTest = screen.getByText('Personal Information');

    expect(topicTest).toBeInTheDocument();
    expect(screen.getByText(/Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Password/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('Logout works properly.', async () => {
    const logoutBtn = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutBtn);
    await waitFor(() => expect(history.location.pathname).toBe(routes.LOGIN));

    const emailAnchor = screen.getByRole('link', { name: /Email Address/i });

    fireEvent.click(emailAnchor);
    await waitFor(() => expect(history.location.pathname).toBe(routes.MY_ACCOUNT_EMAIL));

    const passwordAnchor = screen.getByRole('link', { name: /Password/i });

    fireEvent.click(passwordAnchor);
    await waitFor(() => expect(history.location.pathname).toBe(routes.MY_ACCOUNT_PASSWORD));
  });
});

import * as React from 'react';

import { fireEvent, render, screen, waitFor } from 'utils/test-utils';
import '@testing-library/jest-dom/extend-expect';

import history from 'utils/history';
import { Router as BrowserRouter } from 'react-router-dom';
import { HomeRouterContext } from 'components/home/Router';
import { UserStatus } from 'types/profile';
import Name from 'components/name/Name';
import { noop } from 'lodash/fp';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import config from 'config';
import { FB_PIXEL_CONVERSION_API } from 'constants/api';

describe('Account component with context', () => {
  const server = setupServer(
    rest.post(`${config.baseURI}${FB_PIXEL_CONVERSION_API}`, (req, res, ctx) => {
      return res(ctx.json({ code: 200, data: { message: 'Facebook pixel sent successfully.' } }));
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    render(
      <HomeRouterContext.Provider
        value={{
          state: {
            id: 'ASDF123',
            status: UserStatus.New,
            email: 'test@gmail.com',
            name: 'Test User',
            chargebeeId: '00123',
            salesforceId: '00123S',
            trialOrderStatus: '',
            hasOrder: false,
            leadId: 'leadId',
            dOB: '1997-01-31T18:15:00.000Z',
          },
          dispatch: noop,
        }}
      >
        <BrowserRouter history={history}>
          <Name onContinue={noop} />
        </BrowserRouter>
      </HomeRouterContext.Provider>
    );
  });

  test('Renders the name component properly', () => {
    const headerText = screen.getByText('Now, let’s get to know a bit more about you.');

    const firstNameInput = screen.getByPlaceholderText('eg. Stella');

    const lastNameInput = screen.getByPlaceholderText('eg. Gurbner');

    const continueButton = screen.getByRole('button', { name: /Continue/i });

    expect(headerText).toBeInTheDocument();
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();
  });

  test('Validated the required fields', async () => {
    const firstNameValidationMessageText = 'Please provide your first name';
    const lastNameValidationMessageText = 'Please provide your last name';
    const firstNameValidationMessage = screen.queryByText(firstNameValidationMessageText);
    const lastNameValidationMessage = screen.queryByText(lastNameValidationMessageText);

    expect(firstNameValidationMessage).not.toBeInTheDocument();
    expect(lastNameValidationMessage).not.toBeInTheDocument();
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    fireEvent.click(continueButton);
    const loader = screen.getByTestId('clip-loader');

    expect(loader).toBeInTheDocument();
    await waitFor(() => {
      expect(loader).not.toBeInTheDocument();
    });
    expect(screen.getByText(firstNameValidationMessageText)).toBeInTheDocument();
    expect(screen.getByText(lastNameValidationMessageText)).toBeInTheDocument();
  });
});

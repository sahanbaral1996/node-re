import React from 'react';
import { Router as BrowserRouter } from 'react-router-dom';
import history from 'utils/history';
import { fireEvent, render, screen } from '../utils/test-utils';
import SignIn from 'components/auth/SignIn';
import '@testing-library/jest-dom/extend-expect';

test('loads and sign in page', () => {
  render(
    <BrowserRouter history={history}>
      <SignIn />
    </BrowserRouter>
  );

  const signInInput = screen.getByPlaceholderText('you@example.com');

  expect(signInInput).toBeInTheDocument();

  const passwordinput = screen.getByPlaceholderText('*********');

  expect(passwordinput).toBeInTheDocument();
});

test('validates the required fields', async () => {
  render(
    <BrowserRouter history={history}>
      <SignIn />
    </BrowserRouter>
  );

  const emailValidationMessage = screen.queryByText('Please provide your email address');

  expect(emailValidationMessage).not.toBeInTheDocument();
  const passwordValidationMessage = screen.queryByText('Please provide your password');

  expect(passwordValidationMessage).not.toBeInTheDocument();

  const signInButton = screen.getByRole('button', { name: /Sign in/i });

  fireEvent.click(signInButton);

  expect(await screen.findByText('Please provide your email address')).toBeInTheDocument();
  expect(await screen.findByText('Please provide your password')).toBeInTheDocument();
});

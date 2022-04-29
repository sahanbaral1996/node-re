import * as React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { fireEvent, render, screen } from '../utils/test-utils';
import '@testing-library/jest-dom/extend-expect';
import OrderFeedback from 'components/home/OrderFeedback';
import { FEEDBACK_URL } from 'constants/api';

import config from 'config';

const mockCloseFn = jest.fn();

beforeEach(() => {
  render(<OrderFeedback onClose={mockCloseFn} />);
});

describe('OrderFeedback.tsx', () => {
  const server = setupServer(
    rest.post(`${config.baseURI}${FEEDBACK_URL}`, (req, res, ctx) => {
      return res(ctx.json({ code: 200, data: { message: 'Created Case successfully.' } }));
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('loads the order feedback component', () => {
    const descriptionInput = screen.getByPlaceholderText('Please let us know what is going on');

    expect(descriptionInput).toBeInTheDocument();

    const imageUpload = screen.getByText('Select face photos to upload');

    expect(imageUpload).toBeInTheDocument();
  });

  test('validate the required fields', async () => {
    const descriptionValidationMessage = screen.queryByText('Description is required');

    expect(descriptionValidationMessage).not.toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Send Feedback/i });

    fireEvent.click(submitButton);

    expect(await screen.findByText('Description is required')).toBeInTheDocument();
  });

  test('cancel button closes the order feedback modal', () => {
    const submitButton = screen.getByRole('button', { name: /Cancel/i });

    fireEvent.click(submitButton);

    expect(mockCloseFn).toHaveBeenCalledTimes(1);
  });

  // test('submit button submits the order feedback', () => {
  //   fireEvent.change(screen.getByPlaceholderText('Please let us know what is going on'), {
  //     target: { value: 'Problems with my Acne still persis' },
  //   });

  //   const submitButton = screen.getByRole('button', { name: /Send Feedback/i });

  //   fireEvent.click(submitButton);
  // });
});

describe('OrderFeedback.tsx API fail', () => {
  const server = setupServer(
    rest.post(`${config.baseURI}${FEEDBACK_URL}`, (req, res, ctx) => {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Error in creating case.',
        })
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('proper error on API error', async () => {
    fireEvent.change(screen.getByPlaceholderText('Please let us know what is going on'), {
      target: { value: 'Problems with my Acne still persists.' },
    });

    const submitButton = screen.getByRole('button', { name: /Send Feedback/i });

    fireEvent.click(submitButton);

    expect(await screen.findByText('Error in creating case.')).toBeInTheDocument();
  });
});

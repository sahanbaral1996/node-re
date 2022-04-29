import * as React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom/extend-expect';
import { Router as BrowserRouter } from 'react-router-dom';

import config from 'config';
import history from 'utils/history';
import Reassessment from 'components/reassessment';
import * as routes from 'constants/routes';
import { REASSESSMENT, ACCOUNT_ATTACHMENT } from 'constants/api';
import { fireEvent, render, screen, waitFor } from '../utils/test-utils';

beforeEach(() => {
  render(
    <BrowserRouter history={history}>
      <Reassessment />
    </BrowserRouter>
  );
});

describe('Reassessment.tsx', () => {
  const server = setupServer(
    rest.post(`${config.baseURI}${ACCOUNT_ATTACHMENT}`, (req, res, ctx) => {
      return res(
        ctx.json({
          code: 200,
          message: 'Attachment uploaded successfully.',
          salesForceContentDocumentId: '0696t000HXSLAAW',
        })
      );
    }),
    rest.post(`${config.baseURI}${REASSESSMENT}`, (req, res, ctx) => {
      return res(
        ctx.json({
          code: 200,
          data: {
            errors: [],
            id: 'A086t0000KSJAU',
            selfies: [{ id: '06A6t0000009mAGEAY', success: true, errors: [] }],
            success: true,
          },
        })
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('loads the reassessment component correctly', () => {
    const descriptionInput = screen.getByText('Is your skin improving with your current docent regimen?');

    expect(descriptionInput).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /Back/i });
    const nextButton = screen.getByRole('button', { name: /Continue/i });

    expect(backButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  test('validation works properly for the first question', async () => {
    // test the first question
    const ratingValidation = screen.queryByText('Please select your rating.');

    expect(ratingValidation).not.toBeInTheDocument();

    const continueButton = screen.getByRole('button', { name: /Continue/i });

    fireEvent.click(continueButton);
    expect(await screen.findByText('Please select your rating.')).toBeInTheDocument();

    const sixthOption = screen.getByTestId('button-6');

    fireEvent.click(sixthOption);

    fireEvent.click(continueButton);

    // test the second question
    expect(await screen.findByText('Are you experiencing any redness, irritation or peeling?')).toBeInTheDocument();
  });

  describe('test second question', () => {
    let secondContinueButton: any;

    beforeEach(async () => {
      const sixth = screen.getByTestId('button-6');
      const continueButton = screen.getByRole('button', { name: /Continue/i });

      fireEvent.click(sixth);
      fireEvent.click(continueButton);

      await screen.findByText('Are you experiencing any redness, irritation or peeling?');

      secondContinueButton = screen.getByRole('button', { name: /Continue/i });
    });

    test('validation works for second question', async () => {
      const rednesIrriationValidation = screen.queryByText('Please select a value.');

      expect(rednesIrriationValidation).not.toBeInTheDocument();

      fireEvent.click(secondContinueButton);

      expect(await screen.findByText('Please select a value.')).toBeInTheDocument();
    });

    test('skip next question if there is no redness irritation or peeling', async () => {
      const noBtn = screen.getByRole('radio', { name: /No/i });

      fireEvent.click(noBtn);
      fireEvent.click(secondContinueButton);

      expect(
        await screen.findByText(
          'Have you started any new prescription medications, dermatologist or otherwise, oral or topical?'
        )
      ).toBeInTheDocument();
    });

    test('go to next redness,irritation question if there is redness irritation or peeling', async () => {
      const yesBtn = screen.getByRole('radio', { name: /Yes/i });

      fireEvent.click(yesBtn);
      fireEvent.click(secondContinueButton);

      expect(
        await screen.findByText('On a scale of 1 - 10, how uncomfortable is the redness, irritation or peeling?')
      ).toBeInTheDocument();
      expect(await screen.findByText('Please provide details on what you are experiencing')).toBeInTheDocument();
    });

    describe('test third question', () => {
      let thirdContinueBtn: any;

      beforeEach(async () => {
        const yesBtn = screen.getByRole('radio', { name: /Yes/i });

        fireEvent.click(yesBtn);
        fireEvent.click(secondContinueButton);

        await screen.findByText('On a scale of 1 - 10, how uncomfortable is the redness, irritation or peeling?');

        thirdContinueBtn = screen.getByRole('button', { name: /Continue/i });
      });

      test('questions can be answered properly', async () => {
        const ratingBtn = screen.getByTestId('button-5');
        const rednessLocation = screen.getByPlaceholderText('e.g. Skin around the corners of nose is peeling');

        fireEvent.click(ratingBtn);
        fireEvent.change(rednessLocation, {
          target: { value: 'Cheek and forehead.' },
        });

        fireEvent.click(thirdContinueBtn);
        expect(
          await screen.findByText(
            'Have you started any new prescription medications, dermatologist or otherwise, oral or topical?'
          )
        ).toBeInTheDocument();
      });

      describe('test fourth question', () => {
        let fourthContinueBtn: any;

        beforeEach(async () => {
          fireEvent.click(thirdContinueBtn);
          await screen.findByText(
            'Have you started any new prescription medications, dermatologist or otherwise, oral or topical?'
          );

          fourthContinueBtn = screen.getByRole('button', { name: /Continue/i });
        });

        test('test validation', async () => {
          const validationMsg = screen.queryByText('Please select a value.');

          expect(validationMsg).not.toBeInTheDocument();

          fireEvent.click(fourthContinueBtn);
          expect(await screen.findByText('Please select a value.')).toBeInTheDocument();
        });

        test('medication type is needed when any new medication is started', async () => {
          const yesBtn = screen.getByRole('radio', { name: /Yes/i });

          fireEvent.click(yesBtn);

          expect(await screen.findByText('Please share your new medication.')).toBeInTheDocument();
          expect(await screen.findByPlaceholderText('e.g. Oral contraceptives')).toBeInTheDocument();
        });

        describe('test fifth question', () => {
          let sixthContinueBtn: any;

          beforeEach(async () => {
            const noBtn = screen.getByRole('radio', { name: /No/i });

            fireEvent.click(noBtn);

            fireEvent.click(fourthContinueBtn);
            expect(
              await screen.findByText('Are you pregnant or planning to get pregnant in the next 3 months?')
            ).toBeInTheDocument();

            sixthContinueBtn = screen.getByRole('button', { name: /Continue/i });
          });

          test('test validation', async () => {
            const validationMsg = screen.queryByText(
              'Please select whether you are deciding to get pregnant in three months.'
            );

            expect(validationMsg).not.toBeInTheDocument();

            fireEvent.click(sixthContinueBtn);
            expect(
              await screen.findByText('Please select whether you are deciding to get pregnant in three months.')
            ).toBeInTheDocument();
          });
        });
      });
    });
  });
});

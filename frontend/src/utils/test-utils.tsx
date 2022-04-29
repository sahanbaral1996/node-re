import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import ErrorBoundary from 'components/common/error/ErrorBoundary';

import config from 'config';

const theme = {
  overrides: {
    MuiRadio: {
      root: {
        color: '#495057',
      },
      colorSecondary: {
        '&$checked': {
          color: '#495057',
        },
      },
    },
    MuiCheckbox: {
      root: {
        color: '#495057',
      },
      colorSecondary: {
        '&$checked': {
          color: '#495057',
        },
      },
    },
    MuiFormControlLabel: {
      root: {
        color: '#495057',
      },
    },
  },
};

const muiTheme = createMuiTheme(theme);

const AllTheProviders: FC = ({ children }) => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </MuiThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { default as userEvent } from '@testing-library/user-event';

export const getApiEndPoint = (relativeEndPoint: string) => `${config.baseURI}${relativeEndPoint}`;

export { customRender as render };

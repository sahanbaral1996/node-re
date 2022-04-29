import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Router from './Router';
import ErrorBoundary from './common/error/ErrorBoundary';

import 'izitoast/dist/css/iziToast.css';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';

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

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <SentryErrorBoundary>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </SentryErrorBoundary>
    </MuiThemeProvider>
  );
};

export default App;

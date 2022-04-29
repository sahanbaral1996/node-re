import * as React from 'react';
import ReactDOM from 'react-dom';
import * as FullStory from '@fullstory/browser';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import './public';
import init from './init';
import config from 'config';
import App from './components/App';

init();

if (config.env === 'production' && config.fullstory.orgId) {
  FullStory.init({ orgId: config.fullstory.orgId });
}

declare global {
  interface Window {
    Chargebee: any;
    dataLayer: any;
  }
}

Sentry.init({
  dsn: config.sentry.dsn,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

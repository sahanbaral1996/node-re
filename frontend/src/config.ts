/**
 * Application wide configuration.
 */
const config = {
  env: process.env.NODE_ENV,
  basename: process.env.REACT_APP_BASE_NAME,
  baseURI: process.env.REACT_APP_API_BASE_URI,
  endpoints: {
    login: '/login',
  },
  cognito: {
    region: process.env.REACT_APP_AWS_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_WEB_CLIENT_ID,
  },
  chargebee: {
    site: process.env.REACT_APP_CHARGE_BEE_SITE,
    plan: process.env.REACT_APP_CHARGE_BEE_PLAN,
    publishableKey: process.env.REACT_APP_CHARGE_BEE_PUBLISHABLE_API_KEY,
  },
  fullstory: {
    orgId: process.env.REACT_APP_FULL_STORY_ORG_ID,
  },
  landingPage: process.env.REACT_APP_LANDING_PAGE_URL || '/',
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN,
  },
};

export default config;

import config from 'config';

export function customEvent(eventName: string) {
  isProduction() && window.dataLayer.push({ event: eventName });
}

function isProduction() {
  return config.env === 'production';
}

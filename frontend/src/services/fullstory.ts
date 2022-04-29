import * as FullStory from '@fullstory/browser';
import config from 'config';

export function identify(uid: string, userVars: any) {
  isProduction() && FullStory.identify(uid, userVars);
}

export function anonymize() {
  isProduction() && FullStory.anonymize();
}

export function customEvent(eventName: string, eventProperties?: any) {
  isProduction() && FullStory.event(eventName, eventProperties);
}

function isProduction() {
  return config.env === 'production' && config.fullstory.orgId;
}

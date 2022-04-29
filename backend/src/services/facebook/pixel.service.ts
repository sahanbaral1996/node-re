import * as bizSdk from 'facebook-nodejs-business-sdk';
import { IFbPixelConversionPayload } from 'types/analytics.service.type';

import config from '../../config';
import { FB_PIXEL_PURCHASE } from 'constants/analytics.constants';

export const createServerEvent = async (
  pixelPayload: IFbPixelConversionPayload,
  remoteAddress: string | undefined,
  userAgent: string | undefined
): Promise<any> => {
  const CustomData = bizSdk.CustomData;
  const EventRequest = bizSdk.EventRequest;
  const UserData = bizSdk.UserData;
  const ServerEvent = bizSdk.ServerEvent;

  const access_token = config.facebook.access_token;
  const pixel_id = config.facebook.pixel_id;

  bizSdk.FacebookAdsApi.init(access_token);

  const current_timestamp: number = Math.floor(new Date().valueOf() / 1000);

  const userData = new UserData()
    // It is recommended to send Client IP and User Agent for Conversions API Events.
    .setClientIpAddress(remoteAddress)
    .setClientUserAgent(userAgent);

  let serverEvent = new ServerEvent()
    .setEventName(pixelPayload.eventName)
    .setEventTime(current_timestamp)
    .setUserData(userData)
    .setEventSourceUrl(pixelPayload.eventSourceUrl);

  if (pixelPayload.eventName === FB_PIXEL_PURCHASE) {
    const customData = new CustomData()
      .setCurrency(pixelPayload.customData?.currency)
      .setValue(pixelPayload.customData?.value);

    serverEvent = serverEvent.setCustomData(customData);
  }

  const eventsData = [serverEvent];
  const eventRequest = new EventRequest(access_token, pixel_id).setEvents(eventsData);
  return eventRequest.execute();
};

import { AddOnChargeEvents, ChargeOnTypes } from 'types/chargebee/estimate.types';

export function getEventBasedAddOns(ids: string[]) {
  const eventAddons = ids.map(id => ({
    id,
    charge_on: ChargeOnTypes.OnEvent,
    charge_once: true,
    on_event: AddOnChargeEvents.SubscriptionCreation,
  }));
  return eventAddons;
}

export function getChargbeeAddOns(ids: string[]) {
  const addons = ids.map(id => ({ id }));
  return addons;
}

interface ILineItems {
  entity_id: string;
}

export function hasLineItemWithEntityId(lineItems: ILineItems[], entityId: string) {
  const lineItem = lineItems.find(item => item.entity_id === entityId);
  return !!lineItem;
}

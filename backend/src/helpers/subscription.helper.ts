import { head } from 'ramda';

import { InvoiceEstimate, LineItem, LineItemEntityTypes } from 'types/chargebee/estimate.types';
import { IFormattedEstimate } from 'types/chargebee/subscription.types';

export function formatEstimate(estimate: InvoiceEstimate) {
  const { amountDue, subTotal, total, lineItems, taxes } = estimate;
  const formattedResponse: IFormattedEstimate = { amountDue, subTotal, total, taxes, lineItems };
  const discount = head(estimate.discounts || []);
  if (discount) {
    formattedResponse.discountAmount = discount.amount;
    formattedResponse.description = discount.description;
    formattedResponse.discountDescription = discount.description;
  }
  return formattedResponse;
}

export function filterLineItemsByEntityType(lineItems: LineItem[], entityType: LineItemEntityTypes) {
  return lineItems.filter(lineItem => lineItem.entityType !== entityType);
}

export function filterLineItemsByEntityId(lineItems: LineItem[], entityId: string) {
  return lineItems.filter(lineItem => lineItem.entityId !== entityId);
}

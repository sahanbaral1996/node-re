import { ISubscriptionEstimate } from 'types/subscription';

export function centsToDollar(cents: number) {
  const dollarAmount = (cents / 100).toFixed(2);

  return `$${dollarAmount}`;
}

export function calculatePaymentDueToday(estimate: ISubscriptionEstimate | null) {
  const totalDueToday = estimate?.invoiceEstimate?.amountDue || 0;
  let totalLineItems = 0;
  const lineItems = estimate?.invoiceEstimate?.lineItems.forEach(item => {
    totalLineItems = item.amount - item.discountAmount + totalLineItems;
  });

  return Math.abs(totalLineItems - totalDueToday);
}

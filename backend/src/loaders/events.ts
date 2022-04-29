import EventEmitter from 'events';
import { initializeCustomerEvents } from 'subscribers/customer';

export class CustomEventEmitter extends EventEmitter {}

export default () => {
  const customerEventEmitter = new CustomEventEmitter();
  initializeCustomerEvents({ eventEmitter: customerEventEmitter });
  return customerEventEmitter;
};

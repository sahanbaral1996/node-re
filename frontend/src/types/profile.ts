import { OrderStatus } from 'components/orderReview/OrderReview';
import { IAddonOrder } from './shoppingCart';

export enum UserStatus {
  Assessment = 'Assessment Done',
  BillingInformation = 'Billing Done',
  ImageUploads = 'Images Uploaded',
  TrialCreated = 'Trial Created',
  Active = 'Active',
  InPerson = 'In-Person Done',
  StandaloneOrderConfirmed = 'Order Confirmed',
  InActive = 'InActive',
  FacePhotoUploads = 'Face Photo',
  Complete = 'Complete',
  New = 'New',
  Paused = 'Inactive - Patient Paused',
  TrialCancelled = 'Inactive - Trial Cancelled',
  SubscriptionCancelled = 'Inactive - Subscription Cancelled',
  CancellationImpending = 'Active - Cancellation Impending',
  PaidButTrialNotInitiated = 'Inactive - Paid But Trial Not Initiated',
  InactiveCCDeclined = 'Inactive - CC Declined',
}

export interface IUserProfile {
  dOB: string;
  phone?: string;
  status: UserStatus;
  email: string;
  name: string;
  id: string;
  chargebeeId: string;
  salesforceId: string;
  trialOrderStatus: OrderStatus | '';
  hasOrder: boolean;
  hyperpigmentation: boolean;
  physician: string | '';
  leadId: string;
  isAdmin?: boolean;
  assmtActive?: boolean;
  addons: IAddonOrder[];
  showMyAccount?: boolean;
}

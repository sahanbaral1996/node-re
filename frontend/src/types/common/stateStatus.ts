export enum ActionType {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  IDLE = 'idle',
}

export interface IAction {
  type: ActionType;
  data: any;
  error: Error;
}

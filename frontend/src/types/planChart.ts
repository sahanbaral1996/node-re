export interface CircleProps {
  color: string;
  content?: string;
  gridRow?: string;
  gridRowEnd?: string;
}

export type Content = string | string[];

export interface PhotoPopupProps {
  items: SelectedPhotos[];
  handleClickAway: () => void;
  dimensions: DOMRect | Record<string, never>;
  onClickCloseIcon: () => void;
  visibleItem?: number;
}

export interface Photos {
  id: string;
  url: string;
}
export interface SelectedPhotos extends Photos {
  time?: string;
  groupByName?: string;
}

export enum Status {
  Draft = 'Draft',
  Published = 'Published',
  ShipmentsScheduled = 'Shipments Scheduled',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
}

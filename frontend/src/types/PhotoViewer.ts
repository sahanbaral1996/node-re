import { SelectedPhotos } from 'types/planChart';

export enum PhotoViewerViews {
  GALLERY = 0,
  SINGLE = 1,
}

export interface IPhotoViewerProps {
  items: SelectedPhotos[];
  id?: string;
  handleClose: () => void;
  heading?: string;
  isBack?: boolean;
}

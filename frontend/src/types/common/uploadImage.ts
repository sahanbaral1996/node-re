import * as React from 'react';

export interface ImageFile extends File {
  preview: string;
  id?: string;
}

export interface UploadImageProps {
  title?: React.ReactElement;
  subTitle?: string | React.ReactNode;
  files: Array<ImageFile>;
  isMultipleUpload: boolean;
  onDeleteClick: (filePreview: string) => void;
  onFileUploadImage: (uploadImageFiles: Array<ImageFile>) => void;
  showLoading: boolean;
  childrenPhotoSrc?: string;
  maxSize?: number;
  maxFiles?: number;
  showButton?: boolean;
  solid?: boolean;
}

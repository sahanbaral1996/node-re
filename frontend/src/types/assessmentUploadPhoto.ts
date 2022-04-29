import { UploadImageProps, ImageFile } from './common/uploadImage';

export interface AssessmentUploadPhotoProps {
  steps: Array<Steps>;
  activeStep: number;
  faceImageFiles: Array<ImageFile>;
  skinCareImageFiles: Array<ImageFile>;
  handleContinue: (id: number) => void;
  onFaceDeleteClick: (filePreview: string) => void;
  onSkinCareDeleteClick: (filePreview: string) => void;
  handleOnDropFaceImage: (uploadImageFiles: Array<ImageFile>) => void;
  handleOnDropSkinCareImage: (uploadImageFiles: Array<ImageFile>) => void;
  showLoading: boolean;
  showHeader: boolean;
  handleSkip?: (index: number) => void;
}

export interface Steps {
  index: number;
  label: string;
  imageSource: string;
  completeImage: string;
  activeImage: string;
}

export interface AssessmentUploadStepBodyProps {
  title?: string;
  index: number;
  uploadImage: UploadImageProps;
  buttonText: string;
  handleContinue: (id: number) => void;
  handleBackClick?: () => void;
  handleSkip?: (index: number) => void;
  childrenPhotoSrc?: string;
}

export interface StepButtonIconProps {
  status: string;
  imageSource: string;
}

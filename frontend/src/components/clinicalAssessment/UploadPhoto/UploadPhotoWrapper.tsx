import React, { useState } from 'react';

import UploadPhoto from './UploadPhoto';

import { ImageFile } from 'types/common/uploadImage';
import { OnboardSteps, IOnboardImageProps, PhotoUploadSteps } from 'types/onboard';

import { uploadPhoto } from 'services/uploadPhoto';
import * as FS from 'services/fullstory';

import * as toast from 'utils/toast';
import { handleError } from 'utils/errorHandler';

import { assessmentUploadImage } from 'constants/appConstants';
import { SELFIE_PREFIX, SHELFIE_PREFIX } from 'constants/attachments';
import { en } from 'constants/lang';
import useMountedRef from 'hooks/useMountedRef';
import * as GTM from 'services/tagManager';

import { PIXEL } from 'constants/lang/facebook';
import { fbPixelApiConversion } from 'services/analytics';

/**
 * Plan Charts Component.
 *
 * @returns {React.Component}
 */
const UploadPhotoWrapper: React.FunctionComponent<IOnboardImageProps> = ({
  onContinue,
  activeStep = 0,
  onSuccess,
  showHeader = true,
}) => {
  const [steps, setSteps] = useState(assessmentUploadImage.STEPS);
  const mountedRef = useMountedRef();

  const [faceImageFiles, setFaceImageFiles] = useState<ImageFile[]>([]);
  const [skinCareImageFiles, setSkinCareImageFiles] = useState<ImageFile[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);

  const isInSkinCareStep = (index: number): boolean => index === 1;

  const handleContinue = (index: number): void => {
    const files = isInSkinCareStep(index) ? skinCareImageFiles : faceImageFiles;
    const prefix = isInSkinCareStep(index) ? SHELFIE_PREFIX : SELFIE_PREFIX;

    const failedApiCalls = [];

    const apiCalls = files.map(file => uploadPhoto({ file, prefix }));

    setImageUploadLoading(true);

    // @TODO: better error handling and refactor the failed cases
    Promise.allSettled(apiCalls)
      .then(results => {
        results.forEach((result, idx: number) => {
          if (result.status !== 'fulfilled' || result.value?.code !== 200) {
            failedApiCalls.push(idx);
          }
        });

        if (failedApiCalls.length === files.length) {
          toast.error({ title: 'Error', message: 'Image upload failed.' });
        } else if (failedApiCalls.length) {
          toast.error({ title: 'Error', message: 'Some Image upload failed.' });
        } else {
          toast.success({ title: 'Success', message: 'Image uploaded successfully.' });
          if (!showHeader && onSuccess) {
            onSuccess();
          } else {
            if (index + 1 < steps.length) {
              onContinue(OnboardSteps.RegimenPhoto);
              FS.customEvent(en.fullStoryCusEvent.PHOTO_UPLOAD);
            } else {
              GTM.customEvent(en.tagManagerCusEvent.PHOTO_UPLOAD);
              onContinue(OnboardSteps.Complete);
            }
          }
        }
      })
      .catch(handleError)
      .finally(() => mountedRef.current && setImageUploadLoading(false));
  };

  const uploadFaceImageFiles = (uploadImageFiles: Array<ImageFile>) => {
    setFaceImageFiles([...faceImageFiles, ...uploadImageFiles]);
  };

  const uploadSkinCareImageFiles = (uploadImageFiles: Array<ImageFile>) => {
    setSkinCareImageFiles([...skinCareImageFiles, ...uploadImageFiles]);
  };

  const handleSkip = (step: number) => {
    if (step === 1) {
      GTM.customEvent(en.tagManagerCusEvent.PHOTO_UPLOAD);
      onContinue(OnboardSteps.Complete);
    }
  };

  /**
   * Invoked when delete icon is clicked.
   *
   * @param {string} filePreview
   */
  const deleteFaceImageFile = (filePreview: string) => {
    setFaceImageFiles(faceImageFiles.filter(file => file.preview !== filePreview));
  };

  /**
   * Invoked when delete icon is clicked.
   *
   * @param {string} filePreview
   */
  const deleteSkinCareFile = (filePreview: string) => {
    setSkinCareImageFiles(skinCareImageFiles.filter(file => file.preview !== filePreview));
  };

  React.useEffect(() => {
    if (activeStep === PhotoUploadSteps.FacePhoto) {
      fbPixelApiConversion(PIXEL.PURCHASE);
    }
  }, []);

  return (
    <UploadPhoto
      steps={steps}
      activeStep={activeStep}
      handleContinue={handleContinue}
      faceImageFiles={faceImageFiles}
      skinCareImageFiles={skinCareImageFiles}
      onFaceDeleteClick={deleteFaceImageFile}
      onSkinCareDeleteClick={deleteSkinCareFile}
      handleOnDropFaceImage={uploadFaceImageFiles}
      handleOnDropSkinCareImage={uploadSkinCareImageFiles}
      showLoading={imageUploadLoading}
      showHeader={showHeader}
      handleSkip={handleSkip}
    ></UploadPhoto>
  );
};

export default UploadPhotoWrapper;

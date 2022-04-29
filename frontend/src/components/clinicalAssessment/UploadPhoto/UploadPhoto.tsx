import * as React from 'react';

import { en } from 'constants/lang';
import { AssessmentUploadPhotoProps } from 'types/assessmentUploadPhoto';

import * as faceImage from 'assets/images';
import UploadImageBody from '../../common/UploadImageBody';
import { PhotoUploadSteps } from 'types/onboard';

/**
 * Plan Charts Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const UploadPhoto: React.FunctionComponent<AssessmentUploadPhotoProps> = props => {
  const {
    steps,
    activeStep,
    faceImageFiles,
    handleContinue,
    handleOnDropFaceImage,
    handleOnDropSkinCareImage,
    skinCareImageFiles,
    onFaceDeleteClick,
    onSkinCareDeleteClick,
    showLoading,
    showHeader,
    handleSkip,
  } = props;

  // Get content based on which step is active
  const getStepContent = (step: number) => {
    const facePhotoTitle = (
      <>
        {en.uploadFace.TITLE_SEGMENT1} <span className="color-secondary-pink">{en.uploadFace.TITLE_SEGMENT2}</span>{' '}
        {en.uploadFace.TITLE_SEGMENT3}{' '}
      </>
    );
    const regimenPhotoTitle = (
      <>
        {en.uploadSkinCareProduct.TITLE_SEGMENT1}{' '}
        <span className="color-secondary-pink">{en.uploadSkinCareProduct.TITLE_SEGMENT2}</span>{' '}
        {en.uploadSkinCareProduct.TITLE_SEGMENT3}{' '}
      </>
    );

    switch (step) {
      case 0:
        return (
          <UploadImageBody
            index={0}
            handleContinue={handleContinue}
            childrenPhotoSrc={faceImage.face}
            uploadImage={{
              files: faceImageFiles,
              onDeleteClick: onFaceDeleteClick,
              onFileUploadImage: handleOnDropFaceImage,
              isMultipleUpload: true,
              title: facePhotoTitle,
              showLoading: showLoading,
            }}
            buttonText={en.uploadFace.BUTTON_TEXT}
          ></UploadImageBody>
        );
      case 1:
        return (
          <UploadImageBody
            index={1}
            handleContinue={handleContinue}
            childrenPhotoSrc={faceImage.medicine}
            uploadImage={{
              isMultipleUpload: true,
              files: skinCareImageFiles,
              onDeleteClick: onSkinCareDeleteClick,
              onFileUploadImage: handleOnDropSkinCareImage,
              title: regimenPhotoTitle,
              showLoading: showLoading,
            }}
            buttonText={en.uploadSkinCareProduct.BUTTON_TEXT}
            handleSkip={handleSkip}
          ></UploadImageBody>
        );
      default:
        return 'Unknown step';
    }
  };

  const isFacePhotoStep = activeStep === PhotoUploadSteps.FacePhoto;
  const isRegimenPhotoStep = activeStep === PhotoUploadSteps.RegimenPhoto;
  const { TITLE, PHOTO, FACE_DESCRIPTION, REGIMEN_DESCRIPTION, SELFIE, SHELFIE } = en.uploadPhoto;

  return (
    <div className="assessment-upload-photo__wrapper container">
      <div className={'assessment-upload-photo__wrapper py-10x'}>
        {showHeader && (
          <>
            <h2 className="assessment-upload-photo__header">
              {TITLE}{' '}
              <span className="color-secondary-pink">
                {isFacePhotoStep ? '“' + SELFIE + '”' : isRegimenPhotoStep ? '“' + SHELFIE + '”' : ''}
              </span>{' '}
              {PHOTO}
            </h2>
            <p>{isFacePhotoStep ? FACE_DESCRIPTION : isRegimenPhotoStep ? REGIMEN_DESCRIPTION : ''}</p>
          </>
        )}
        {getStepContent(activeStep)}
      </div>
    </div>
  );
};

export default UploadPhoto;

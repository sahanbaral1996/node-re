import * as React from 'react';

import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

import Button from 'components/common/button';
import UploadImage from 'components/common/UploadImage';

import { en } from 'constants/lang';
import { AssessmentUploadStepBodyProps } from 'types/assessmentUploadPhoto';

import PhotoViewer from 'components/home/PhotoViewer';
import { sampleImages } from './sampleImage';
import { PhotoUploadSteps } from 'types/onboard';

/**
 * Upload Image body Common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const UploadImageBody: React.FunctionComponent<AssessmentUploadStepBodyProps> = props => {
  const {
    uploadImage,
    title,
    handleContinue,
    index,
    buttonText,
    childrenPhotoSrc,
    handleBackClick,
    handleSkip,
  } = props;

  const [imagePopupVisisble, setImagePopupVisible] = React.useState<boolean>(false);

  const showSamplePhoto = () => {
    setImagePopupVisible(true);
  };

  const hideImagePopup = () => {
    setImagePopupVisible(false);
  };

  return (
    <div className={'assessment-upload-step-body__wrapper'}>
      <div className="assessment-upload-step-body__title">{title}</div>
      <UploadImage
        files={uploadImage.files}
        title={uploadImage.title}
        onDeleteClick={uploadImage.onDeleteClick}
        childrenPhotoSrc={childrenPhotoSrc}
        onFileUploadImage={uploadImage.onFileUploadImage}
        isMultipleUpload={uploadImage.isMultipleUpload}
        subTitle={uploadImage.subTitle}
        showLoading={uploadImage.showLoading}
      ></UploadImage>
      <div className="assessment-upload-step-body__bottom">
        <div className="assessment-upload-step-body__privacy-policy">{en.uploadStepBody.PRIVACY_POLICY}</div>
        <div className="assessment-upload-step-body__photo-acceptance">
          {en.uploadStepBody.PHOTO_ACCEPTANCE}{' '}
          {index === PhotoUploadSteps.FacePhoto && (
            <span onClick={showSamplePhoto}>{en.uploadStepBody.SAMPLE_PHOTO}</span>
          )}
        </div>
        {handleSkip ? (
          <div className="assessment-upload__step-skip" onClick={() => handleSkip(index)}>
            {en.uploadStepBody.SKIP}
          </div>
        ) : (
          ''
        )}
        <div className="upload-image-body__button-wrapper">
          {handleBackClick ? (
            <Button
              title="Back"
              color="secondary"
              onClick={handleBackClick}
              className="mr-4"
              disabled={uploadImage.showLoading}
            />
          ) : null}
          <button
            className={
              !uploadImage.files?.length || uploadImage.showLoading ? 'btn btn-primary disabled' : 'btn btn-primary'
            }
            disabled={!uploadImage.files.length || uploadImage.showLoading}
            onClick={() => handleContinue(index)}
          >
            <span className="assessment-upload-button__item-wrapper">
              <div>{buttonText}</div>
              <ArrowRightAltIcon />
            </span>
          </button>
        </div>
      </div>
      {imagePopupVisisble ? (
        <PhotoViewer
          items={sampleImages.map(photo => ({
            url: photo.srcUrl,
            id: photo.id,
            groupByName: photo.groupByName,
          }))}
          handleClose={hideImagePopup}
          heading={en.sampleImage.HEADING}
        />
      ) : null}
    </div>
  );
};

export default UploadImageBody;

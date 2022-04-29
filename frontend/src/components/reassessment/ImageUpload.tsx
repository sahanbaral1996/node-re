import * as React from 'react';
import { face, faceRed } from 'assets/images';

import { en } from 'constants/lang';
import { ImageUploadKeys } from 'types/reassessment';
import UploadImageBody from '../common/UploadImageBody';
import HeaderLine from 'components/common/HeaderLine';

/**
 * Reassessment Image upload.
 *
 * @param {Object} props
 */
const ImageUpload: React.FC<ImageUploadKeys> = ({
  handleImageUploaded,
  deleteFaceImageFile,
  onSubmit,
  files,
  isLoading,
  handleBackClick,
}) => {
  const facePhotoTitle = (
    <>
      {en.uploadFace.TITLE_SEGMENT1} <span className="color-secondary-pink">{en.uploadFace.TITLE_SEGMENT2}</span>{' '}
      {en.uploadFace.TITLE_SEGMENT3}{' '}
    </>
  );

  const { TITLE, PHOTO, FACE_DESCRIPTION, SELFIE } = en.uploadPhoto;

  return (
    <>
      <HeaderLine />
      <div className="reassessment-upload-photo__wrapper">
        <div className="upload-photo__container reupload__body">
          <div className="assessment-upload-photo__wrapper py-6x-md">
            <>
              <h2 className="assessment-upload-photo__header mb-4x">
                {TITLE} <span className="color-secondary-pink">{'“' + SELFIE + '”'}</span> {PHOTO}
              </h2>

              <p>{FACE_DESCRIPTION}</p>
            </>
          </div>
          <UploadImageBody
            handleBackClick={handleBackClick}
            childrenPhotoSrc={face}
            uploadImage={{
              title: facePhotoTitle,
              isMultipleUpload: true,
              onFileUploadImage: handleImageUploaded,
              files,
              onDeleteClick: deleteFaceImageFile,
              showLoading: isLoading,
            }}
            handleContinue={onSubmit}
            index={0}
            buttonText={en.uploadFace.BUTTON_TEXT}
          ></UploadImageBody>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;

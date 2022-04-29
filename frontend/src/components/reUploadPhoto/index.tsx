import * as React from 'react';

import * as toast from 'utils/toast';
import { useHistory } from 'react-router-dom';
import Button from 'components/common/button';
import ClipLoader from 'react-spinners/ClipLoader';
import { ArrowRightAlt } from '@material-ui/icons';

import UploadImage from 'components/common/UploadImage';
import { addPhotosToAccount } from 'services/reUploadPhoto';

import useUploadImage from 'hooks/useUploadImage';

import { en } from 'constants/lang';
import { face } from 'assets/images';
import * as routes from 'constants/routes';
import { handleError } from 'utils/errorHandler';

const title = (
  <>
    {en.reUploadPhoto.TITLE_SEGMENT1} <span className="color-secondary-pink">{en.reUploadPhoto.TITLE_SEGMENT2}</span>{' '}
    {en.reUploadPhoto.TITLE_SEGMENT3}{' '}
  </>
);

const ReUploadPhoto: React.FC = () => {
  const [files, fileIds, loading, handleImageUploaded, deleteFaceImageFile] = useUploadImage();
  const [isFileUploading, setIsFileUploading] = React.useState<boolean>(false);

  const history = useHistory();

  const uploadImages = async () => {
    setIsFileUploading(true);

    try {
      const { message } = await addPhotosToAccount(fileIds);

      toast.success({
        title: en.reUploadPhoto.SUCCESS_TITLE,
        message: message || en.reUploadPhoto.SUCCESS_BODY,
      });

      history.push(routes.ORDER_CONFIRMED);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFileUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="reupload__body">
        <h2 className="reupload__title pt-10x">
          {en.reUploadPhoto.TITLE} <span className="color-secondary-pink">{en.reUploadPhoto.FACE}</span>{' '}
          {en.reUploadPhoto.PHOTOS}
        </h2>
        <div className="mt-10x">
          <UploadImage
            title={title}
            files={files}
            onDeleteClick={deleteFaceImageFile}
            onFileUploadImage={handleImageUploaded}
            isMultipleUpload={false}
            showLoading={loading}
            childrenPhotoSrc={face}
          />
        </div>
        <div className="text-center">
          <div className="assessment-upload-step-body__privacy-policy">{en.uploadStepBody.PRIVACY_POLICY}</div>
          <div className="assessment-upload-step-body__photo-acceptance">{en.uploadStepBody.PHOTO_ACCEPTANCE}</div>
        </div>
        <Button
          onClick={() => uploadImages()}
          className="btn btn-primary mt-12x text-left d-flex justify-content-between align-items-center reupload__upload-btn mx-auto"
          disabled={fileIds?.length < 1 || isFileUploading}
          fullWidth
        >
          <span>{en.reUploadPhoto.UPLOAD_BUTTON}</span>
          {isFileUploading ? (
            <span style={{ marginLeft: '24px' }}>
              <ClipLoader loading={true} size={18} color="white" />
            </span>
          ) : (
            <ArrowRightAlt />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReUploadPhoto;

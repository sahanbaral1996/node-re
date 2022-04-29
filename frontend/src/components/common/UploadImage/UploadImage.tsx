import React, { useCallback } from 'react';

import Dropzone from 'react-dropzone';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import * as toast from 'utils/toast';
import Loader from 'components/common/Loader';

import { en } from 'constants/lang';
import { UploadImageProps, ImageFile } from 'types/common/uploadImage';
import { head } from 'lodash/fp';
import { isArray } from 'lodash';

const ACCEPT_TYPE = '.jpeg, .png, .jpg';

const DEFAULT_MAX_FILE_SIZE = 5000000; // 5mb in bytes
const DEFAULT_MAX_FILES = 5;

const FILE_TOO_LARGE_ERR = 'file-too-large';
const FILES_TOO_MANY_ERR = 'too-many-files';

/**
 * UploadImage common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const UploadImage: React.FunctionComponent<UploadImageProps> = props => {
  const {
    title,
    subTitle,
    isMultipleUpload,
    onFileUploadImage,
    files,
    childrenPhotoSrc,
    onDeleteClick,
    showLoading,
    maxSize = DEFAULT_MAX_FILE_SIZE,
    maxFiles = DEFAULT_MAX_FILES,
    showButton = true,
    solid = false,
  } = props;

  const MAX_FILE_ERROR_MSG = `We’re sorry! You can only upload ${maxFiles} photos.`;

  /**
   * Invoked when images are dropped or uploaded.
   */
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (isArray(fileRejections) && fileRejections.length) {
        const { errors } = head(fileRejections);
        const error: { code: string; message: string } | undefined = head(errors);

        if (!error) {
          return;
        }
        const { code, message } = error;

        if (code === FILE_TOO_LARGE_ERR) {
          toastErrorMessage('File is larger than 5 megabytes');
        } else if (code === FILES_TOO_MANY_ERR) {
          toastErrorMessage(MAX_FILE_ERROR_MSG);
        } else {
          toastErrorMessage(message);
        }
      } else {
        if (acceptedFiles.length + files.length > DEFAULT_MAX_FILES) {
          toastErrorMessage(MAX_FILE_ERROR_MSG);

          return;
        }

        const uploadImageFiles = acceptedFiles.map((file: ImageFile) => {
          file.preview = URL.createObjectURL(file);

          return file;
        });

        onFileUploadImage(uploadImageFiles);
      }
    },

    [onFileUploadImage]
  );

  const imageUploadVaidator = () => {
    if (files.length >= maxFiles) {
      return {
        code: FILES_TOO_MANY_ERR,
        message: MAX_FILE_ERROR_MSG,
      };
    }

    return null;
  };

  const toastErrorMessage = (message: string, title = 'Error') => {
    toast.error({
      title: title,
      message: message,
    });
  };

  return (
    <Dropzone
      accept={ACCEPT_TYPE}
      multiple={isMultipleUpload}
      onDrop={onDrop}
      maxSize={maxSize}
      validator={imageUploadVaidator}
      maxFiles={maxFiles}
    >
      {({ getRootProps, getInputProps, isDragActive }) => {
        if (showLoading) {
          return (
            <div className={`upload__wrapper ${solid ? 'review solid' : ''}`}>
              <div className="upload__loading-container">
                <Loader />
              </div>
            </div>
          );
        }

        return (
          <section>
            {files.length === 0 ? (
              <div
                className={`upload__wrapper upload__wrapper-clickable ${solid ? 'review solid' : ''} ${
                  isDragActive ? 'upload__wrapper-drag' : ''
                }`}
                {...getRootProps()}
              >
                <div className="upload__container">
                  <input {...getInputProps()} data-testid="file-upload" />
                  <div className="assessment_photo_upload_sample-image">
                    {childrenPhotoSrc ? <img src={childrenPhotoSrc} alt="image" /> : null}
                  </div>
                  <div className="upload__header mb-4x">{title}</div>
                  <div className="upload__sub-header mb-6x">{subTitle}</div>
                  {showButton && <button className="btn btn-secondary">Upload photos</button>}
                </div>
              </div>
            ) : (
              <div
                className={`upload__wrapper ${solid ? 'review solid' : ''} ${
                  isDragActive ? 'upload__wrapper-drag' : ''
                }`}
              >
                <div className="upload__photo-container">
                  <input {...getInputProps()} />
                  {files.map((file: ImageFile, index: number) => (
                    <div className="upload__images" key={index}>
                      <img src={file.preview} alt="uploaded file" />
                      <div className="upload__delete-container">
                        <IconButton onClick={() => onDeleteClick(file.preview)} style={{ padding: '0px' }}>
                          <Delete style={{ color: '#495057' }} />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="upload__add-more-photos-container">
                  <div className="upload__add-more-photos" {...getRootProps()}>
                    {en.uploadImage.ADD_PHOTO}
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      }}
    </Dropzone>
  );
};

UploadImage.defaultProps = {
  subTitle: '',
  isMultipleUpload: true,
  onFileUploadImage: () => {},
};

export default UploadImage;

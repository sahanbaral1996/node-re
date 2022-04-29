import * as React from 'react';

import { formatDate } from 'utils/date';
import Close from '@material-ui/icons/Close';
import { ArrowBack } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

import SinglePhoto from './SinglePhoto';
import PhotoGallery from './PhotoGallery';
import Modal from 'components/common/Modal';

import { IPhotoViewerProps, PhotoViewerViews } from 'types/PhotoViewer';

const HeaderItem: React.FunctionComponent<{
  onClose: () => void;
  currentView: PhotoViewerViews;
  heading: string;
  handleBack: () => void;
  isBack: boolean;
}> = ({ onClose, currentView, heading, handleBack, isBack }) => {
  return (
    <div className="modal__header justify-content-between">
      {currentView === PhotoViewerViews.SINGLE && isBack ? (
        <IconButton style={{ height: '26px', width: '26px' }} onClick={handleBack}>
          <ArrowBack />
        </IconButton>
      ) : (
        <div></div>
      )}
      <span>{heading}</span>
      <IconButton style={{ height: '26px', width: '26px' }} onClick={onClose}>
        <Close />
      </IconButton>
    </div>
  );
};

const PhotoViewer: React.FunctionComponent<IPhotoViewerProps> = ({
  items,
  handleClose,
  id = '',
  heading = '',
  isBack = true,
}) => {
  const [currentPhoto, setCurrentPhoto] = React.useState<string>(id);

  const [index, setIndex] = React.useState<string>('');

  const getCurrentMode = currentPhoto ? PhotoViewerViews.SINGLE : PhotoViewerViews.GALLERY;

  const getSelectedPhoto = (id: string) => items.find(item => item.id === id) || { id: '', url: '', time: '' };

  const currentHeading = currentPhoto
    ? formatDate(getSelectedPhoto(currentPhoto).time || '', 'MMM dd, yyyy h:mm aaa')
    : heading;

  const backButtonHandler = () => {
    setCurrentPhoto('');
  };
  const nextPhoto = () => {
    const index = items.findIndex(item => item.id === currentPhoto) + 1;

    if (index < items.length) {
      setCurrentPhoto(items[index].id);
    }
  };

  const previousPhoto = () => {
    const index = items.findIndex(item => item.id === currentPhoto) - 1;

    if (index > -1) {
      setCurrentPhoto(items[index].id);
    }
  };

  const imageSelectionHandler = (id: string) => {
    setCurrentPhoto(id);
  };

  React.useEffect(() => {
    const index = items.findIndex(item => item.id === currentPhoto);

    if (index === 0) {
      setIndex('first');
    } else if (index === items.length - 1) {
      setIndex('last');
    } else {
      setIndex('');
    }
  }, [currentPhoto]);

  const isGalleryMode = getCurrentMode === PhotoViewerViews.GALLERY;

  return (
    <Modal
      header={
        <HeaderItem
          onClose={handleClose}
          currentView={getCurrentMode}
          heading={currentHeading}
          handleBack={backButtonHandler}
          isBack={isBack}
        />
      }
      className={isGalleryMode ? '' : 'photo-viewer__single-mode'}
    >
      {isGalleryMode ? (
        <PhotoGallery photos={items} selectImageHandler={imageSelectionHandler} />
      ) : (
        <SinglePhoto
          selectedPhoto={getSelectedPhoto(currentPhoto)}
          next={nextPhoto}
          previous={previousPhoto}
          index={index}
        />
      )}
    </Modal>
  );
};

export default PhotoViewer;

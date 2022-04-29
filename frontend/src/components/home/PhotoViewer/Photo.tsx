import * as React from 'react';

import { TransformComponent } from 'react-zoom-pan-pinch';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { SelectedPhotos } from 'types/planChart';

import { en } from 'constants/lang';

const Photo: React.FC<{
  index: string;
  previous: () => void;
  selectedPhoto: SelectedPhotos;
  next: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
  zoomIn: () => void;
}> = ({ index, previous, next, zoomIn, zoomOut, selectedPhoto, resetTransform }) => {
  return (
    <React.Fragment>
      <div className="single-photo__nav">
        {index !== 'first' && (
          <IconButton
            className="nav__left"
            onClick={() => {
              resetTransform();
              previous();
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
        {index !== 'last' && (
          <IconButton
            className="nav__right"
            onClick={() => {
              resetTransform();
              next();
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </div>
      <TransformComponent>
        <img className="single-photo__img" src={selectedPhoto.url} alt="Selfie Image" />
      </TransformComponent>
      <ButtonGroup
        variant="text"
        classes={{
          root: 'single-photo__btn-groups',
        }}
      >
        <Button title={en.photoViewer.ZOOM_OUT} onClick={() => zoomOut()}>
          <ZoomOutIcon className="mx-2x" />
        </Button>
        <Button title={en.photoViewer.ZOOM_IN} onClick={() => zoomIn()}>
          <ZoomInIcon className="mx-2x" />
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
};

export default Photo;

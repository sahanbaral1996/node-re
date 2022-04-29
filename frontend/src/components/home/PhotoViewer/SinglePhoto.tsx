import * as React from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Photo from './Photo';

import { SelectedPhotos } from 'types/planChart';

const SinglePhoto: React.FunctionComponent<{
  selectedPhoto: SelectedPhotos;
  next: () => void;
  previous: () => void;
  index: string;
}> = ({ selectedPhoto, next, previous, index }) => {
  return (
    <div className="single-photo__container">
      <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <Photo
            index={index}
            selectedPhoto={selectedPhoto}
            next={next}
            previous={previous}
            zoomOut={zoomOut}
            zoomIn={zoomIn}
            resetTransform={resetTransform}
          />
        )}
      </TransformWrapper>
    </div>
  );
};

export default SinglePhoto;

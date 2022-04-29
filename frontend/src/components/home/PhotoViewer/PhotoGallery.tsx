import * as React from 'react';

import { groupBy } from 'lodash';
import { format } from 'date-fns';

import { SelectedPhotos } from 'types/planChart';

const PhotoGallery: React.FunctionComponent<{ photos: SelectedPhotos[]; selectImageHandler: (id: string) => void }> = ({
  photos,
  selectImageHandler,
}) => {
  const groupedPhoto = groupBy(photos, photo =>
    photo.groupByName ? photo.groupByName : format(new Date(photo.time || ''), 'dd MMM yyyy')
  );

  return (
    <div className="photo-gallery__container photo-gallery--max-height custom-scrollbar pb-4x">
      {Object.keys(groupedPhoto).map((groupHeading, idx) => (
        <div className="mt-4x" key={idx}>
          <div className="photo-gallery__group-heading">{groupHeading}</div>
          <div className="mt-2x mx-neg-2x my-neg-2x d-flex flex-wrap">
            {groupedPhoto[groupHeading].map(photo => (
              <img
                src={photo.url}
                key={photo.id}
                alt="Selfie Image"
                className="photo-gallery__img mx-2x my-2x"
                onClick={() => selectImageHandler(photo.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;

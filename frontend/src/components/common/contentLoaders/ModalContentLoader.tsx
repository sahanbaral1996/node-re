import * as React from 'react';

import ContentLoader from 'react-content-loader';

const ModalContentLoader: React.FunctionComponent = () => (
  <div>
    <ContentLoader speed={2} width={250} height={30} viewBox="0 0 250 30">
      <rect rx="4" ry="4" width="250" height="30" />
    </ContentLoader>

    {Array(7)
      .fill('')
      .map((_, index) => (
        <div key={index} className="mt-2x">
          <ContentLoader speed={2} width={500} height={20} viewBox="0 0 500 20">
            <rect rx="4" ry="4" width="500" height="20" />
          </ContentLoader>
        </div>
      ))}
  </div>
);

export default ModalContentLoader;

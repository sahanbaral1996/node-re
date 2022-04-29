import * as React from 'react';

import ContentLoader from 'react-content-loader';

interface ButtonContentProps {
  noOfBtns?: number;
}

const ButtonContentLoader: React.FunctionComponent<ButtonContentProps> = ({ noOfBtns = 1 }) => (
  <div data-testid="button-loader">
    {Array(noOfBtns)
      .fill('')
      .map((_, index) => (
        <ContentLoader speed={2} width={260} height={40} viewBox="0 0 260 40" key={index} className="mr-3x">
          <rect rx="4" ry="4" width="240" height="40" />
        </ContentLoader>
      ))}
  </div>
);

export default ButtonContentLoader;

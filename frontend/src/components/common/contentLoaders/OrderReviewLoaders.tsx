import * as React from 'react';
import ContentLoader from 'react-content-loader';

export const RxLoader: React.FC = () => (
  <ContentLoader viewBox="0 0 364 150">
    <rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
    <circle x="20" y="20" cx="16" cy="50" r="16" />
    <rect x="40" y="36" rx="4" ry="4" width="150" height="23" />
    <rect x="40" y="65" rx="4" ry="4" width="300" height="20" />
    <rect x="40" y="90" rx="4" ry="4" width="300" height="20" />
    <rect x="40" y="115" rx="4" ry="4" width="250" height="20" />
  </ContentLoader>
);

export const CardSkinConditionSkeleton = ({ ...rest }) => (
  <ContentLoader viewBox="0 0 364 110" backgroundColor="white" {...rest}>
    <rect x="0" y="0" width="24" height="24" />
    <rect x="34" y="0" width="150" height="24" />
    <rect x="0" y="42" width="24" height="24" />
    <rect x="34" y="42" width="150" height="24" />
    <rect x="0" y="84" width="24" height="24" />
    <rect x="34" y="84" width="100" height="24" />
  </ContentLoader>
);

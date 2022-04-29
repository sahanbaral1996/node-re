import * as React from 'react';

import ContentLoader from 'react-content-loader';

import logo from 'assets/images/logo.svg';

const HeaderContentLoader: React.FunctionComponent = () => (
  <header className="site-header small--hide app-header">
    <div className="header-layout">
      <img src={logo} alt="Revea logo" className="app-logo" />
      <ContentLoader speed={2} width={207} height={41} viewBox="0 0 207 41">
        <circle cx="20" cy="20" r="20" />
        <rect x="50" y="8" rx="2" ry="2" width="150" height="6" />
        <rect x="50" y="26" rx="2" ry="2" width="100" height="6" />
      </ContentLoader>
    </div>
  </header>
);

export default HeaderContentLoader;

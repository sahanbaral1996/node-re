import React from 'react';

/**
 * Loader common component.
 */
const Loader: React.FC = () => {
  return (
    <div className="spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;

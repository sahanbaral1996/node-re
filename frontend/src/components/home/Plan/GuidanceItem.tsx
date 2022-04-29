import * as React from 'react';

const GuidanceItem: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="user-guidance-item">
      <h5 className="mb-2x">{title}</h5>
      {children}
    </div>
  );
};

export default GuidanceItem;

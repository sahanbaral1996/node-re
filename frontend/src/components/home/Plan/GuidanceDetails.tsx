import React from 'react';

import { iconChevronRight } from 'assets/images';

const GuidanceDetails: React.FC<{
  details: React.ReactNode[] | React.ReactNode;
  title: string;
  onShowDetails: (details: React.ReactNode) => void;
}> = ({ details, onShowDetails, title, children }) => {
  return (
    <>
      <img src={iconChevronRight} alt="Chevron right" className="mr-2x mt-1x" />
      <button
        className="btn-link"
        onClick={() =>
          onShowDetails(
            <div className="container user-plan-details">
              <h3 className="mb-4x">{title}</h3>
              {Array.isArray(details) ? (
                details.map((node, idx) => (
                  <div className="user-plan-details-item mb-6x" key={idx}>
                    {node}
                  </div>
                ))
              ) : (
                <div className="user-plan-details-item">{details}</div>
              )}
            </div>
          )
        }
      >
        {children}
      </button>
    </>
  );
};

export default GuidanceDetails;

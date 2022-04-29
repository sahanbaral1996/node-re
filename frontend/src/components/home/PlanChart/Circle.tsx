import * as React from 'react';

import { CircleProps } from 'types/planChart';

/**
 * Circle Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const Circle: React.FunctionComponent<CircleProps> = props => {
  const { color, content, gridRow = '', gridRowEnd = '' } = props;

  return (
    <div className="circle__outer-wrapper" style={{ gridRowStart: gridRow, gridRowEnd }}>
      <div className="circle__inner-wrapper">
        <svg
          className="first-circle"
          width="91"
          height="92"
          viewBox="0 0 91 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="45.5" cy="46" rx="45.5" ry="46" fill={color} />
        </svg>
        <svg
          className="second-circle"
          width="91"
          height="93"
          viewBox="0 0 91 93"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M90 46.5C90 71.6496 70.0563 92 45.5 92C20.9437 92 1 71.6496 1 46.5C1 21.3504 20.9437 1 45.5 1C70.0563 1 90 21.3504 90 46.5Z"
            stroke="#3C4866"
            strokeWidth="2"
          />
        </svg>
        <span className="circle-content">{content}</span>
      </div>
    </div>
  );
};

export default Circle;

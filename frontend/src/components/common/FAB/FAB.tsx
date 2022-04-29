import { Fab } from '@material-ui/core';
import useWindowDimensions from 'hooks/useWindowDimensions';
import React from 'react';

// FAB landing tooltip show/hide timeout
const FAB_TIMEOUT = 10000;

type FABProps = {
  onClick: () => void;
  tooltip?: string;
  icon: string;
  showTooltipOnMobile: boolean;
};

const FAB: React.FC<FABProps> = ({ onClick = () => {}, tooltip, icon, showTooltipOnMobile }) => {
  const { width } = useWindowDimensions();
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [isLanding, setIsLanding] = React.useState<boolean>(true);

  const isMobile: boolean = width < 575;

  React.useEffect(() => {
    setTimeout(function () {
      setIsLanding(false);
    }, FAB_TIMEOUT);
  }, []);

  const showTooltip = () => {
    if (isMobile && !showTooltipOnMobile) {
      return false;
    }

    return true;
  };

  const showTooltipToggle = (isHovered: boolean) => {
    if (isHovered || isLanding) {
      return 'fab-tooltip order order-1 mr-3x';
    }

    return 'fab-tooltip order order-1 mr-3x hideTooltip';
  };

  return (
    <div
      className="btn-fab"
      onClick={onClick}
      onMouseOver={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <Fab className="fab-button order order-2">
        <img className="fab-icon" src={icon} alt="FAB button icon" />
      </Fab>
      {tooltip && showTooltip() && (
        <div className={showTooltipToggle(isHovered)}>
          <div className="fab-tooltip-text px-4x py-2x">{tooltip}</div>
        </div>
      )}
    </div>
  );
};

export default FAB;

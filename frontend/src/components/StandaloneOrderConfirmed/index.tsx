import React, { useEffect } from 'react';
import Button from 'components/common/button/Buttton';
import { en } from 'constants/lang';
import { REVEA_LANDING } from 'constants/routes';
import lines from 'assets/images/lines.png';

import { PIXEL } from 'constants/lang/facebook';
import { fbPixelApiConversion } from 'services/analytics';

const StandaloneOrderConfirmed = () => {
  useEffect(() => {
    fbPixelApiConversion(PIXEL.START_TRIAL);
  }, []);

  return (
    <div className="standalone-OC-container pt-12x">
      {/* <img className="standalone-OC-image__line" src={lines} alt="billing-lines" /> */}
      <div className="container content">
        <div className="OC__container mx-auto text-center">
          <p className="OC__title">{en.waitConfirmModal.TITLE}</p>
          <p className="OC__subtitle">{en.waitConfirmModal.SUBTITLE}</p>
          <p className="OC__description">{en.waitConfirmModal.BODY}</p>
          <p className="OC__description order-confirmed__spam-info">{en.waitConfirmModal.SPAM_INFO}</p>
          <a href={REVEA_LANDING}>
            <Button color="quaternary" className="order-confirmed__btn">
              <span>{en.waitConfirmModal.LOGOUT}</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StandaloneOrderConfirmed;

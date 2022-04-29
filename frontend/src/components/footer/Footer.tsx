import * as React from 'react';

import FooterLine from 'components/common/FooterLine';

import * as routes from 'constants/routes';

const Footer: React.FunctionComponent = () => (
  <div className="footer-wrapper mt-0x-sm mt-18x-md mt-0x-lg">
    <FooterLine />
    <footer className="site-footer">
      <div className="footer-layout row justify-content-between mr-0x">
        <ul className="footer-links social-links d-flex flex-column flex-row-lg pl-4x pl-0x-md mb-4x-md">
          <li className="mb-2x">
            <a href={routes.FACEBOOK} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </li>
          <li className="mb-2x">
            <a href={routes.INSTAGRAM} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
          <li className="mb-2x">
            <a href={routes.INSTAGRAM} target="_blank" rel="noreferrer">
              TikTok
            </a>
          </li>
          {/* commented out because the link does not exist */}
          {/* <li className="mb-2x">
            <a href={routes.TWITTER} target="_blank" rel="noreferrer">
              Twitter
            </a>
          </li> */}
        </ul>
        <ul className="footer-links company-links d-flex flex-column flex-row-lg pl-4x pl-0x-md">
          <li className="mb-2x">
            <a href={routes.PRIVACY_PRACTICES} target="_blank" rel="noreferrer">
              Privacy Practices
            </a>
          </li>
          <li className="mb-2x">
            <a href={routes.PRIVACY_POLICY} target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
          </li>
          <li className="mb-2x">
            <a href={routes.TOA} target="_blank" rel="noreferrer">
              Terms of Use
            </a>
          </li>
          <li className="mb-2x">
            <a href={routes.TELE_DERMA} target="_blank" rel="noreferrer">
              Telehealth Consent
            </a>
          </li>
          <li className="mb-2x">
            <a href={routes.TELE_DERMA} target="_blank" rel="noreferrer">
              Cookie Policy
            </a>
          </li>
          <li className="mb-2x">
            <a href={routes.FAQ} target="_blank" rel="noreferrer">
              FAQs
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
);

export default Footer;

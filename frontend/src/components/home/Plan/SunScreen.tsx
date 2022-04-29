import React from 'react';

import { en } from 'constants/lang';

const Title: React.FC<{ content: string }> = ({ content }) => (
  <p>
    <strong>{content}</strong>
  </p>
);

const SunScreenItem: React.FC<{ title: string }> = ({ title, children }) => (
  <>
    <p>
      <b>{title}</b>
    </p>
    {children}
  </>
);

const SunScreen = () => {
  return (
    <>
      <SunScreenItem title={en.yourPlan.SUN_SCREEN.IMPORTANCE.TITLE}>
        <ul>
          {en.yourPlan.SUN_SCREEN.IMPORTANCE.CONTENT_LIST.map((text, index) => (
            <li key={index}>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </SunScreenItem>
      <SunScreenItem title={en.yourPlan.SUN_SCREEN.APPLICATION.TITLE}>
        <ul>
          {en.yourPlan.SUN_SCREEN.APPLICATION.CONTENT_LIST.map((text, index) => (
            <li key={index}>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </SunScreenItem>
      <SunScreenItem title={en.yourPlan.SUN_SCREEN.PRODUCT_OPTIONS.TITLE}>
        <>
          <p className="mb-4x">{en.yourPlan.SUN_SCREEN.PRODUCT_OPTIONS.FIRST_PARAGRAPH}</p>
          <p>{en.yourPlan.SUN_SCREEN.PRODUCT_OPTIONS.SECOND_PARAGRAPH}</p>
          <ul className="list-style-none">
            {en.yourPlan.SUN_SCREEN.PRODUCT_OPTIONS.CONTENT_LIST.map(({ TITLE, DETAILS }, index) => (
              <li key={index}>
                <strong className="d-block">{TITLE}</strong>
                <span>{DETAILS}</span>
              </li>
            ))}
          </ul>
        </>
      </SunScreenItem>
      <SunScreenItem title={en.yourPlan.SUN_SCREEN.TIPS.TITLE}>
        <ul>
          {en.yourPlan.SUN_SCREEN.TIPS.CONTENT_LIST.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </SunScreenItem>
    </>
  );
};

export default SunScreen;

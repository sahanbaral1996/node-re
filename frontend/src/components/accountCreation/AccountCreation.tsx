import * as React from 'react';
import { useEffect } from 'react';

import { useFormik } from 'formik';
import { clearValue, readValue } from 'utils/localStorage';

import ReveaInput from 'components/common/ReveaInput';
import ReveaCheckbox from 'components/common/ReveaCheckbox';
import PasswordInput from 'components/common/PasswordInput';

import { eligiblePackaging } from 'assets/images';
import HeaderLine from 'components/common/HeaderLine';

import { createCustomer } from 'services/customer';
import { userRegistrationValidation } from 'services/assessment';
import ErrorMessage from 'components/common/ErrorMessage';

import { en } from 'constants/lang';
import * as routes from 'constants/routes';
import Button from 'components/common/button';
import { userAccountRegistration } from 'schemas/userRegistration';
import { handleError } from 'utils/errorHandler';
import { Link, useHistory } from 'react-router-dom';
import useMountedRef from 'hooks/useMountedRef';

import * as GTM from 'services/tagManager';
import Header from 'components/header/Header';
import { LOCAL_STORAGE_ELIGIBILITY } from 'constants/assessment';

import { UserEligibilityFormValues } from '../eligibility/Eligibility';
import { setupAuthentication } from 'services/auth';

import { PIXEL } from 'constants/lang/facebook';
import { fbPixelApiConversion } from 'services/analytics';

const { userRegistration } = en;

const createAccountInitialFormValue = {
  password: '',
  confirmPassword: '',
  email: '',
  noppToa: false,
  newsletter: false,
};

const duplicateEmailMessage = 'DUPLICATE_EMAIL';

const DuplicateEmail = ({ errorMessage }: { errorMessage?: string }) =>
  errorMessage === duplicateEmailMessage ? (
    <>
      {userRegistration.DUPLICATE_EMAIL.MESSAGE} <Link to={routes.LOGIN}>login here</Link>
    </>
  ) : (
    errorMessage
  );

const AccountCreation: React.FC = () => {
  const history = useHistory();
  const mountedRef = useMountedRef();
  const formik = useFormik({
    initialValues: createAccountInitialFormValue,
    validationSchema: userAccountRegistration,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        try {
          await userRegistrationValidation({ email: values.email });
          GTM.customEvent(en.tagManagerCusEvent.LEAD_CREATED);
        } catch (error) {
          if (error.response?.status === 409) {
            formik.setFieldError('email', duplicateEmailMessage);

            return;
          }

          throw error;
        }
        const eligibilityData = readValue<UserEligibilityFormValues>(LOCAL_STORAGE_ELIGIBILITY);

        if (eligibilityData) {
          const response = await createCustomer({
            password: values.password,
            email: values.email,
            noppToa: values.noppToa,
            newsletter: values.newsletter,
            ...eligibilityData,
          });

          await setupAuthentication(response.data);
          clearValue(LOCAL_STORAGE_ELIGIBILITY);

          history.push(routes.NAME);
        } else {
          throw new Error('Eligibility is undefined');
        }
      } catch (error) {
        handleError(error);
      } finally {
        if (mountedRef.current) {
          setSubmitting(false);
        }
      }
    },
  });

  const onBack = () => {
    history.push(routes.ELIGIBILITY);
  };

  useEffect(() => {
    fbPixelApiConversion(PIXEL.LEAD);
  }, []);

  const { errors, touched, values, handleChange } = formik;

  return (
    <>
      <Header showLogin />
      <HeaderLine />
      <div className="user-registration__wrapper">
        <h2 className="user-registration__header">{userRegistration.TITLE}</h2>
        <img src={eligiblePackaging} className="mb-x user-registration__eligible-package" />
        <div className="user-registration__package-description mt-5x mb-8x">
          <p className="user-registration__sub-title">{userRegistration.PRODUCT_DESCRIPTION.TITLE}</p>
          <p>{userRegistration.PRODUCT_DESCRIPTION.SUBTITLE_TWO}</p>
        </div>
        <div className="user-registration__sub-title mb-10x">{userRegistration.SUBTITLE}</div>
        <form onSubmit={formik.handleSubmit}>
          <div className="user-registration__body">
            <div className="user-registration__input-wrapper">
              <ReveaInput
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder={userRegistration.EMAIL.PLACEHOLDER}
                label={userRegistration.EMAIL.LABEL}
                errorMessage={errors.email && touched.email ? DuplicateEmail({ errorMessage: errors.email }) : ''}
              ></ReveaInput>
            </div>
            <div className="user-registration__input-wrapper">
              <PasswordInput
                name={'password'}
                type="password"
                value={values.password}
                onChange={handleChange}
                label={en.createPassword.PASSWORD}
                placeholder={en.createPassword.PASSWORD_PLACEHOLDER}
                errorMessage={errors.password && touched.password ? errors.password : ''}
              />
            </div>
            <div className="user-registration__password-requirement mb-2x">
              <p className="font-weight-bold mb-1x">{en.passwordRequirement.TITLE}</p>
              <ul>
                {en.passwordRequirement.REQUIREMENTS.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="user-registration__input-wrapper">
              <PasswordInput
                type="password"
                onChange={handleChange}
                name={'confirmPassword'}
                value={values.confirmPassword}
                label={en.createPassword.CONFIRM_PASSWORD}
                placeholder={en.createPassword.PASSWORD_PLACEHOLDER}
                errorMessage={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
              />
            </div>
            <ReveaCheckbox
              name="noppToa"
              label={
                <span>
                  {userRegistration.TERMS_OF_SERVICE.PRIVACY_LINK_TEXT_PREFIX}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-registration__links"
                    href={routes.PRIVACY_POLICY}
                  >
                    {userRegistration.TERMS_OF_SERVICE.PRIVACY_LINK_TEXT}
                  </a>
                  ,{' '}
                  <a target="_blank" rel="noopener noreferrer" className="user-registration__links" href={routes.TOA}>
                    {userRegistration.TERMS_OF_SERVICE.TERMS_OF_SERVICE_LINK_TEXT}
                  </a>{' '}
                  {userRegistration.TERMS_OF_SERVICE.PRIVACY_LINK_TEXT_SUFFIX}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="user-registration__links"
                    href={routes.PRIVACY_PRACTICE_LINK}
                  >
                    {userRegistration.TERMS_OF_SERVICE.TERMS_OF_PRIVACY_PRACTICE}
                  </a>
                </span>
              }
              onChange={handleChange}
              checked={formik.values.noppToa}
            ></ReveaCheckbox>
            {errors.noppToa && touched.noppToa ? <ErrorMessage message={errors.noppToa} /> : null}
            <ReveaCheckbox
              name="newsletter"
              label={<span>{userRegistration.NEWSLETTER.LABEL}</span>}
              onChange={handleChange}
              checked={formik.values.newsletter}
            ></ReveaCheckbox>
            <div className="mt-10x">
              {' '}
              <span className="font-weight-bold">{userRegistration.FOOTERQUESTIONS}</span>
              {userRegistration.FOOTERCHECKOUT}{' '}
              <a href={routes.FAQ} target="_blank" rel="noreferrer noopener" className="custom-link">
                {userRegistration.FOOTERLINK}
              </a>
            </div>
          </div>
          <Button title="Back" type="button" color="secondary" className="mr-4" onClick={onBack} />
          <Button loading={formik.isSubmitting} title="Continue" type="submit"></Button>
        </form>
      </div>
    </>
  );
};

export default AccountCreation;

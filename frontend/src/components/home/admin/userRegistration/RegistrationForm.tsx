import * as React from 'react';
import * as routes from 'constants/routes';

import HeaderLine from 'components/common/HeaderLine';

import { en } from 'constants/lang';
import useMountedRef from 'hooks/useMountedRef';

import ReveaInput from 'components/common/ReveaInput';
import ReveaDatePicker from 'components/common/ReveaDatePicker';
import Button from 'components/common/button';

import { userRegistrationSchema } from 'schemas/userRegistration';
import { handleError } from 'utils/errorHandler';
import { useLocation, useHistory } from 'react-router-dom';

import { useFormik } from 'formik';
import { createLead, updateLead } from 'services/createLead';
import { getLeadFromId } from 'services/users';

import { userRegistrationValidation } from 'services/assessment';

import ContentLoader from 'react-content-loader';

const { registrationForm } = en;
const underAgedErrorMessage = 'Your age must be above 18 years';
const duplicateEmailMessage = 'This email is already used';

const registrationFormInitialFormValue = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
};

interface IUserRegistration {
  isEditEnabled: boolean;
  isLoaded: boolean;
}

/**
 * Props for RegistrationForm.
 *
 * @param { () => void } resetSpotTreatmentSelection - Callback to clear order state.
 *
 */
type RegistrationFormProps = {
  resetSpotTreatmentSelection: () => void;
};

export type UserEligibilityFormValues = typeof registrationFormInitialFormValue;

/**
 * Main RegistrationForm component.
 *
 * @param { RegistrationFormProps } RegistrationFormProps Callback to clear order status.
 *
 */
const RegistrationForm = ({ resetSpotTreatmentSelection }: RegistrationFormProps) => {
  const history = useHistory();
  const mountedRef = useMountedRef();

  const [registrationFormState, setRegistrationFormState] = React.useState<IUserRegistration>({
    isEditEnabled: false,
    isLoaded: false,
  });

  const useQueryString = () => {
    const location = useLocation();

    return new URLSearchParams(location.search);
  };
  const queryString = useQueryString();
  const leadId = queryString.get('id') as string;

  React.useEffect(() => {
    (async () => {
      try {
        window.scroll(0, 0);
        if (leadId) {
          const response = await getLeadFromId(leadId);
          const { data } = response;

          const leadData = data.data;

          registrationFormik.setValues({
            firstName: leadData.firstName,
            lastName: leadData.lastName,
            dob: leadData.dOB,
            email: leadData.email,
          });
          setRegistrationFormState({ isEditEnabled: true, isLoaded: true });
        } else {
          setRegistrationFormState({ isEditEnabled: false, isLoaded: true });
        }
      } catch (error) {
        handleError(error, { title: 'ERROR OCCURED', message: 'PLEASE TRY AGAIN' });
        history.push(routes.ADMIN_USER);
      }
    })();
  }, []);

  const registrationFormik = useFormik({
    initialValues: registrationFormInitialFormValue,
    validationSchema: userRegistrationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        try {
          await userRegistrationValidation({ email: values.email, dob: values.dob });
        } catch (error) {
          if (error.response?.status === 406) {
            registrationFormik.setFieldError('dob', underAgedErrorMessage);

            return;
          }
          if (error.response?.status === 409) {
            registrationFormik.setFieldError('email', duplicateEmailMessage);

            return;
          }
          throw error;
        }
        if (!registrationFormState.isEditEnabled) {
          const response = await createLead({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            dob: values.dob,
            noppToa: true,
            newsletter: true,
            state: 'California',
          });

          history.push(`${routes.ADMIN_USER_PRODUCT_PAYMENT_INFORMATION}?id=${response.data.data.id}`);
        } else {
          await updateLead(leadId, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            dob: values.dob,
            noppToa: true,
            newsletter: true,
            state: 'California',
          });

          history.push(`${routes.ADMIN_USER_PRODUCT_PAYMENT_INFORMATION}?id=${leadId}`);
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
  const { errors, touched } = registrationFormik;

  return (
    <>
      <HeaderLine />
      <div className="user-signIn__wrapper">
        {!registrationFormState.isLoaded ? (
          <div className="col-12 loader">
            <ContentLoader viewBox="0 0 100 400">
              <rect x="0" y="8" rx="3" ry="3" width="52" height="6" />
              <rect x="0" y="26" rx="3" ry="3" width="40" height="6" />
              <rect x="0" y="56" rx="3" ry="3" width="410" height="3" />
              <rect x="0" y="72" rx="3" ry="3" width="380" height="3" />
              <rect x="0" y="88" rx="3" ry="3" width="178" height="3" />
            </ContentLoader>
          </div>
        ) : (
          <form onSubmit={registrationFormik.handleSubmit} className="user-signIn">
            {registrationFormState.isEditEnabled ? (
              <h1 className="user-signIn__header">{en.registrationForm.UPDATE}</h1>
            ) : (
              <h1 className="user-signIn__header">{en.registrationForm.TITLE}</h1>
            )}

            <h3 className="user-signIn__header">{en.registrationForm.SUBTITLE}</h3>
            <div className="user-signIn__body">
              <div className="user-signIn__input-wrapper">
                <ReveaInput
                  name="firstName"
                  label="First Name"
                  value={registrationFormik.values.firstName}
                  onChange={registrationFormik.handleChange}
                  placeholder={en.registrationForm.FIRST_NAME}
                  errorMessage={errors.firstName && touched.firstName ? errors.firstName : ''}
                />
              </div>
              <div className="user-signIn__input-wrapper">
                <ReveaInput
                  name="lastName"
                  label="Last Name"
                  value={registrationFormik.values.lastName}
                  onChange={registrationFormik.handleChange}
                  placeholder={en.registrationForm.LAST_NAME}
                  errorMessage={errors.lastName && touched.lastName ? errors.lastName : ''}
                />
              </div>
              <div className="user-signIn__input-wrapper">
                <ReveaDatePicker
                  name="dob"
                  value={registrationFormik.values.dob}
                  label={en.registrationForm.BIRTHDAY.LABEL}
                  placeholder=""
                  onChange={registrationFormik.setFieldValue}
                  errorMessage={errors.dob && touched.dob ? errors.dob : ''}
                />
              </div>
              <div className="user-signIn__input-wrapper">
                <ReveaInput
                  name="email"
                  label="Email Address"
                  value={registrationFormik.values.email}
                  onChange={registrationFormik.handleChange}
                  placeholder={en.registrationForm.EMAIL_PLACEHOLDER}
                  errorMessage={errors.email && touched.email ? errors.email : ''}
                />
              </div>
              <div className="button">
                {registrationFormState.isEditEnabled ? (
                  <>
                    <Button
                      loading={registrationFormik.isSubmitting}
                      fullWidth
                      title="Update User"
                      type="submit"
                    ></Button>

                    <div className="start-over">
                      Want to start over?{' '}
                      <span
                        className="create-user"
                        onClick={() => {
                          resetSpotTreatmentSelection();
                          history.push(routes.ADMIN_USER);
                        }}
                      >
                        Create new user
                      </span>
                    </div>
                  </>
                ) : (
                  <Button
                    loading={registrationFormik.isSubmitting}
                    fullWidth
                    title="Create User"
                    type="submit"
                  ></Button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default RegistrationForm;

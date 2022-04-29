import * as React from 'react';
import { useFormik } from 'formik';

import PasswordInput from 'components/common/PasswordInput';
import Button from 'components/common/button/Buttton';

import { en } from 'constants/lang';
import { CreatePasswordProps } from 'types/assessment';
import { createPasswordSchema } from 'schemas/createPassword';
import * as GTM from 'services/tagManager';

const createPasswordInitialFormValue = {
  password: '',
  confirmPassword: '',
};
const CreatePassword: React.FC<CreatePasswordProps> = ({ onSubmitCreatePassword }) => {
  const formik = useFormik({
    initialValues: createPasswordInitialFormValue,
    validationSchema: createPasswordSchema,
    onSubmit: values => {
      onSubmitCreatePassword({ password: values.password });
      GTM.customEvent(en.tagManagerCusEvent.USER_REGISTERED);
    },
  });

  const { errors, touched, handleChange, handleSubmit, values } = formik;

  return (
    <div className="create-password">
      <div className="question-block">
        <h3 className="create-password__title">{en.createPassword.TITLE}</h3>
        <p className="create-password__description">{en.createPassword.DESCRIPTION}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="answer-block">
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
        </div>
        <div className="create-password__bottom">
          <Button title="Continue" type="submit" fullWidth />
        </div>
      </form>
    </div>
  );
};

export default CreatePassword;

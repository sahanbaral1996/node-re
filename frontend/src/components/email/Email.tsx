import React from 'react';

import { useFormik } from 'formik';

import ReveaInput from 'components/common/ReveaInput';
import { handleError } from 'utils/errorHandler';
import Button from 'components/common/button';

import { postLead } from 'services/leads';
import useMountedRef from 'hooks/useMountedRef';

import * as toast from 'utils/toast';

import { en } from 'constants/lang';

const { FORM } = en.email;

const INITIAL_VALUES = {
  email: '',
};

const EmailForm: React.FC<{ onSuccess: () => void; state: string }> = ({ onSuccess, state }) => {
  const mountedRef = useMountedRef();
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await postLead({ ...values, state });
        toast.success({ title: FORM.SUCCESS_TITLE, message: FORM.SUCCESS_MESSAGE });
        onSuccess();
      } catch (error) {
        if (error.response.status === 409) {
          formik.setFieldError('email', FORM.ALREADY_EXISTS_MESSAGE);
        } else {
          handleError(error);
        }
      } finally {
        if (mountedRef.current) {
          setSubmitting(false);
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-6x mb-2x text-initial">
        <ReveaInput
          label={FORM.EMAIL.LABEL}
          placeholder={FORM.EMAIL.PLACEHOLDER}
          value={formik.values.email}
          onChange={formik.handleChange}
          name="email"
          errorMessage={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
        />
      </div>
      <Button loading={formik.isSubmitting} type="submit" fullWidth title={FORM.JOIN_BUTTON_LABEL} />
    </form>
  );
};

export default EmailForm;

import * as React from 'react';

import { useFormik } from 'formik';

import Button from 'components/common/button';
import Textarea from 'components/common/Textarea';
import ErrorMessage from 'components/common/ErrorMessage';

import { en } from 'constants/lang';
import { EditDialogProps, EditDialogForm } from 'types/orderReviews';
import { createPasswordSchema } from 'schemas/editDialogSchema';

const EditDialog: React.FunctionComponent<EditDialogProps> = ({
  isLoading,
  onClickCloseIcon,
  onSendToReveaClick,
  getTitle,
  getHeader,
}) => {
  const initialFormValue: EditDialogForm = { description: '' };

  const formik = useFormik({
    initialValues: initialFormValue,
    validationSchema: createPasswordSchema,
    onSubmit: (values: EditDialogForm) => {
      onSendToReveaClick(values);
    },
  });

  const { errors, handleSubmit, touched, handleChange, values } = formik;

  return (
    <>
      {getTitle(en.orderReviewFeedback.TITLE)}
      {getHeader()}
      <form onSubmit={handleSubmit}>
        <div className="order-review-edit-dialog__body">
          <div className="order-review-edit-dialog__question">{en.orderReviewFeedback.SUBTITLE}</div>
          <div className="textarea__border">
            <Textarea
              onChange={handleChange}
              value={values['description']}
              name="description"
              placeholder={en.orderReviewFeedback.TEXT_AREA_PLACEHOLDER}
              label=""
              className="order-review-feedback__textarea"
            ></Textarea>
          </div>
          {errors.description && touched.description ? <ErrorMessage message={errors.description} /> : ''}
        </div>
        <div className="order-review-edit-dialog__button-wrapper">
          <Button
            loading={isLoading}
            type="submit"
            title={en.orderReviewEditDialog.BUTTON_TEXT}
            color="quaternary"
            className="btn-new btn__feedback--send"
          ></Button>
          <Button
            onClick={onClickCloseIcon}
            type="button"
            title={en.orderReviewEditDialog.BUTTON_CANCEL_TEXT}
            className="btn-new"
            color="secondary"
          ></Button>
        </div>
      </form>
    </>
  );
};

export default EditDialog;

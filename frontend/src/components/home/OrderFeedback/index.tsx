import * as React from 'react';
import { useFormik } from 'formik';

import * as toast from 'utils/toast';

import Modal from 'components/common/Modal';
import Button from 'components/common/button';
import Textarea from 'components/common/Textarea';
import Border from 'components/common/Border/Border';
import ErrorMessage from 'components/common/ErrorMessage';

import { en } from 'constants/lang';
import { handleError } from 'utils/errorHandler';
import { postFeedback } from 'services/orderFeedback';
import { feedbackSchema } from 'schemas/feedbackSchema';
import { OrderFeedbackProps } from 'types/orderFeedback';
import UploadImage from 'components/common/UploadImage';
import useUploadImage from 'hooks/useUploadImage';
import useMountedRef from 'hooks/useMountedRef';

const OrderFeedback: React.FC<OrderFeedbackProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [files, fileIds, loading, handleImageUploaded, deleteFaceImageFile] = useUploadImage();
  const mountedRef = useMountedRef();

  const feedbackFormik = useFormik({
    initialValues: {
      description: '',
    },
    validationSchema: feedbackSchema,
    onSubmit: async ({ description }) => {
      setIsSubmitting(true);
      try {
        await postFeedback({ description, selfies: fileIds });
        onClose();
      } catch (err) {
        handleError(err);
      } finally {
        if (mountedRef.current) {
          setIsSubmitting(false);
        }
      }
    },
  });

  return (
    <Modal className="order-feedback__modal" isClose={onClose} data-testid="order-feedback">
      <form className="order-feedback" onSubmit={feedbackFormik.handleSubmit}>
        <h2 className="order-feedback__title">{en.orderFeedback.TITLE}</h2>

        <Border>
          <Textarea
            name="description"
            value={feedbackFormik.values.description}
            placeholder={en.orderFeedback.DESCRIPTION_PLACEHOLDER}
            onChange={feedbackFormik.handleChange}
            onBlur={feedbackFormik.handleBlur}
          />
        </Border>
        {feedbackFormik.touched.description && feedbackFormik.errors.description && (
          <ErrorMessage message={en.orderFeedback.DESCRIPTION_ERROR} />
        )}
        <div className="mt-8x">
          <UploadImage
            title={<>{en.orderFeedback.UPLOAD_TITLE}</>}
            subTitle={
              <React.Fragment>
                <div>{en.orderFeedback.UPLOAD_SUBTITLE}</div>
                <div>{en.orderFeedback.UPLOAD_SUBTITLE_LINE_2}</div>
              </React.Fragment>
            }
            files={files}
            onDeleteClick={deleteFaceImageFile}
            onFileUploadImage={handleImageUploaded}
            isMultipleUpload={false}
            showLoading={loading}
          />
        </div>
        <div className="mt-5x">
          <Button
            type="submit"
            title="Send Feedback"
            className="order-feedback__submit mr-0x mr-2x-sm mb-2x mb-0x-sm"
            loading={isSubmitting}
          />
          <Button type="button" title="Cancel" color="secondary" onClick={onClose} />
        </div>
      </form>
    </Modal>
  );
};

export default OrderFeedback;

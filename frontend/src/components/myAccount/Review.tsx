import * as React from 'react';
import { useFormik } from 'formik';

import Modal from 'components/common/Modal';
import Button from 'components/common/button';
import Textarea from 'components/common/Textarea';
import Border from 'components/common/Border/Border';
import ErrorMessage from 'components/common/ErrorMessage';

import { en } from 'constants/lang';
import { handleError } from 'utils/errorHandler';
import Rating from '@material-ui/lab/Rating';
import { OrderFeedbackProps } from 'types/orderFeedback';
import UploadImage from 'components/common/UploadImage';
import useUploadImage from 'hooks/useUploadImage';
import useMountedRef from 'hooks/useMountedRef';
import { activeNoButton, activeYesButton, baseYesNoButton, uploadIcon } from 'assets/images';
import { withStyles } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { reviewSchema } from 'schemas/reviewSchema';
import { addReview } from 'services/review';
import iziToast from 'izitoast';
import { HomeRouterContext } from 'components/home/Router';

const YES_BUTTON_STYLE = { backgroundColor: '#208CF014', color: '#208CF0' };
const NO_BUTTON_STYLE = { backgroundColor: '#FF1E000F', color: '#FF1E00' };

type ReviewYesNoButtonProps = {
  value: boolean | undefined | null;
};

type InitialValuesType = { yourExperience: string; rating: number; recommend: boolean | undefined | null };

const INITIAL_VALUES = {
  yourExperience: '',
  rating: 0,
  recommend: undefined,
};

const ReviewYesButton: React.FC<ReviewYesNoButtonProps> = ({ value }) => {
  const showButton = () => {
    return !!value;
  };

  return (
    <div className="toggle-yes-no-button">
      <img className={showButton() ? 'show-element' : ''} src={activeYesButton} alt="button" />
      <img className={!showButton() ? 'show-element' : ''} src={baseYesNoButton} alt="button" />
      <div className="review recommend button text">Yes</div>
    </div>
  );
};

const ReviewNoButton: React.FC<ReviewYesNoButtonProps> = ({ value }) => {
  const showButton = () => {
    if (value === false) {
      return true;
    }

    return false;
  };

  return (
    <div className="toggle-yes-no-button">
      <img className={showButton() ? 'show-element' : ''} src={activeNoButton} alt="button" />
      <img
        className={!showButton() ? 'show-element' : ''}
        style={{
          transform: 'rotate(180deg)',
        }}
        src={baseYesNoButton}
        alt="button"
      />
      <div className="review recommend button text">No</div>
    </div>
  );
};

const Review: React.FunctionComponent = () => {
  const mountedRef = useMountedRef();
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [files, fileIds, loading, handleImageUploaded, deleteFaceImageFile, handleResetForm] = useUploadImage();
  const { state: userProfile } = React.useContext(HomeRouterContext);

  const StyledToggleButtonGroup = withStyles(theme => ({
    grouped: {
      textTransform: 'none',
      transition: '0.2s ease',
      height: '93px',
      marginRight: theme.spacing(4),
      border: 'none',
      '&:not(:first-child)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-child': {
        borderRadius: theme.shape.borderRadius,
      },
    },
  }))(ToggleButtonGroup);

  const StyledRating = withStyles(theme => ({
    iconActive: {
      transform: 'none',
    },
  }))(Rating);

  const reviewFormik = useFormik({
    initialValues: INITIAL_VALUES as InitialValuesType,
    validationSchema: reviewSchema,
    onSubmit: async ({ yourExperience, rating, recommend }, { resetForm }) => {
      setIsSubmitting(true);
      try {
        await addReview({ yourExperience, rating, recommend, picture: fileIds }, userProfile?.id || '');
        iziToast.success({ message: 'Review submitted successfully.' });
        resetForm(); // reset formik fields
        handleResetForm(); // reset upload image
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
    <>
      <form className="order-feedback" onSubmit={reviewFormik.handleSubmit}>
        <div className="review title mb-3x">{en.Review.TITLE}</div>

        <div className="review description mb-8x">{en.Review.DESCRIPTION}</div>
        <div className="review rating mb-6x">
          <div className="review question mb-2x">{en.Review.RATING_QUESTION}</div>
          <StyledRating
            name="rating"
            value={reviewFormik.values.rating}
            size="large"
            onChange={reviewFormik.handleChange}
          />
        </div>

        <div className="recommend mb-8x">
          <div className="review question mb-2x">{en.Review.RECOMMEND_QUESTION}</div>
          <StyledToggleButtonGroup
            exclusive
            value={reviewFormik.values.recommend}
            onChange={(event, value) => {
              reviewFormik.setValues({ ...reviewFormik.values, recommend: value });
            }}
          >
            <ToggleButton name="recommend" value={true} style={reviewFormik.values.recommend ? YES_BUTTON_STYLE : {}}>
              <ReviewYesButton value={reviewFormik.values.recommend} />
            </ToggleButton>
            <ToggleButton
              name="recommend"
              value={false}
              style={reviewFormik.values.recommend === false ? NO_BUTTON_STYLE : {}}
            >
              <ReviewNoButton value={reviewFormik.values.recommend} />
            </ToggleButton>
          </StyledToggleButtonGroup>
          {reviewFormik.touched.recommend && reviewFormik.errors.recommend && (
            <ErrorMessage message={en.Review.RECOMMEND_ERROR} />
          )}
        </div>

        <Border
          isError={reviewFormik.errors.yourExperience ? (reviewFormik.touched.yourExperience ? true : false) : false}
        >
          <Textarea
            name="yourExperience"
            value={reviewFormik.values.yourExperience}
            label={en.Review.YOUR_EXPERIENCE_LABEL}
            placeholder={en.Review.YOUR_EXPERIENCE_PLACEHOLDER}
            onChange={reviewFormik.handleChange}
          />
        </Border>
        {reviewFormik.touched.yourExperience && reviewFormik.errors.yourExperience && (
          <ErrorMessage message={en.Review.YOUR_EXPERIENCE_ERROR} />
        )}
        {/* UPLOAD IMAGE SECTON */}
        <div className="mt-8x mb-4x">
          <UploadImage
            subTitle={
              <React.Fragment>
                <div>
                  <img className="mb-3x" src={uploadIcon} alt="upload icon" />
                  <div className="review upload-image title mb-2x">{en.Review.UPLOAD_IMAGE_TITLE}</div>
                  <div className="review upload-image descripton">{en.Review.UPLOAD_IMAGE_DESCRIPTION}</div>
                </div>
              </React.Fragment>
            }
            files={files}
            onDeleteClick={deleteFaceImageFile}
            onFileUploadImage={handleImageUploaded}
            isMultipleUpload={true}
            showLoading={loading}
            showButton={false}
            solid={true}
          />
        </div>

        <div className="review disclaimer mb-6x">{en.Review.DISCLAIMER}</div>

        {/* SUBMIT BUTTON SECTION */}
        <div className="mt-5x">
          <Button
            type="submit"
            title="Send Feedback"
            className="order-feedback__submit mr-2x"
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          />
        </div>
      </form>
    </>
  );
};

export default Review;

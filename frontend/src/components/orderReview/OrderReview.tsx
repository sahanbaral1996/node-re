import * as React from 'react';
import { useHistory } from 'react-router-dom';

import DOMPurify from 'dompurify';
import { AxiosResponse } from 'axios';
import parse from 'html-react-parser';

import EditDialog from './EditDialog';
import Button from 'components/common/button';
import SkinConditionImageLayout from 'components/common/SkinConditionImageLayout';
import { HomeRouterContext, IUserProfileActionType } from 'components/home/Router';
import { theEssentialCreamFamily, theMightySpotCorrectorFamily, oralMedicationFamily, washFamily } from 'assets/images';
import OrderConfirmation from 'components/common/OrderConfirmation';
import SkinConditionModal from 'components/home/PersonalizedSolution/SkinConditionModal';
import { RxLoader } from 'components/common/contentLoaders/OrderReviewLoaders';
import HeaderLine from 'components/common/HeaderLine';

import { getDateRange } from 'utils/date';
import { handleError } from 'utils/errorHandler';

import { en } from 'constants/lang';
import * as routes from 'constants/routes';

import { IOrderReview } from 'types/orderReview';
import { EditDialogForm } from 'types/orderReviews';
import { UserStatus } from 'types/profile';
import { IMappedOrderItems } from 'types/plan';
import { getOrderReview, updateOrderReview, approveOrderReview } from 'services/orderReview';

export const BASE_DATA = {
  skinConditions: [],
  orderReviewDetails: {
    aTPWhatarewetreating: '',
    aTPYourRX: '',
    aTPLetsgetstarted: '',
    aTPLifestylefactorstoconsider: '',
    effectiveDate: '',
    endDate: '',
    id: '',
    status: '',
    productName: '',
    goals: [],
  },
  orderItems: [],
  addonItems: [],
};

export enum OrderStatus {
  Draft = 'Draft',
  Published = 'Published',
  ShipmentsScheduled = 'Shipments Scheduled',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
  OnHold = 'On Hold',
  PendingApproval = 'Pending Approval',
}

/**
 * Order review main component.
 */
const OrderReview: React.FunctionComponent = () => {
  const history = useHistory();
  const [isUpdatingOrder, setIsUpdatingOrder] = React.useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState<boolean>(false);
  const [review, setReview] = React.useState<IOrderReview>(BASE_DATA);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [approveLoading, setApproveLoading] = React.useState<boolean>(false);
  const [isOrderApprove, setIsOrderApprove] = React.useState<boolean>(false);
  const [isFeedbackSend, setIsFeedbackSend] = React.useState<boolean>(false);
  const [showConditionDetails, setShowConditionDetails] = React.useState<boolean>(false);

  const { state: userProfile, dispatch } = React.useContext(HomeRouterContext);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response: AxiosResponse = await getOrderReview();

        setReview(response.data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [setReview, setLoading]);

  const sendToRevea = async (values: EditDialogForm) => {
    const { orderReviewDetails } = review;

    try {
      setIsUpdatingOrder(true);
      await updateOrderReview(orderReviewDetails.id, values);
      setIsUpdatingOrder(false);
      setIsEditDialogOpen(false);
      setIsFeedbackSend(true);
    } catch (error) {
      setIsUpdatingOrder(false);
      handleError(error);
    }
  };

  const getHeader = (): React.ReactElement => {
    return (
      <>
        <h2 className="order-review__title">{en.orderReview.REGIMEN}</h2>
        <p className="regimen-details">
          {getDateRange(review?.orderReviewDetails?.effectiveDate, review?.orderReviewDetails?.endDate)}
        </p>
      </>
    );
  };

  const approveOrder = async (): Promise<void> => {
    const { orderReviewDetails } = review;

    setApproveLoading(true);
    try {
      const { message } = await approveOrderReview(orderReviewDetails.id);

      setIsOrderApprove(true);
    } catch (error) {
      handleError(error);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleApproveMessageBtnClick = () => {
    setIsOrderApprove(false);

    if (userProfile) {
      dispatch({
        type: IUserProfileActionType.isLoaded,
        payload: { ...userProfile, status: UserStatus.Active, trialOrderStatus: '' },
      });
    }
    history.push(routes.HOME);
  };

  const handleFeedbackSuccessInfoBtnClick = () => {
    if (userProfile) {
      dispatch({
        type: IUserProfileActionType.isLoaded,
        payload: { ...userProfile, trialOrderStatus: OrderStatus.OnHold },
      });
    }
    history.push(routes.ON_HOLD);

    setIsFeedbackSend(false);
  };

  const getTitle = (title: string): React.ReactElement => {
    return <div className="order-review__detail--title">{title}:</div>;
  };

  const OrderApproveMessage = () => (
    <>
      {getTitle(en.orderApproveMessage.TITLE)}
      {getHeader()}
      <div className="order-approve__detail--subtitle">{en.orderApproveMessage.SUBTITLE}</div>
      <div className="order-approve__detail--question">{en.orderApproveMessage.QUESTION}</div>
      <p className="order-approve__detail--answer">{en.orderApproveMessage.DESCRIPTION}</p>
      <Button
        onClick={() => {
          handleApproveMessageBtnClick();
        }}
        color="quaternary"
        className="py-4x text-left d-inline-flex align-items-center white order-rx__btn btn-new"
      >
        <span>{en.orderApproveMessage.BTN_MESSAGE}</span>
      </Button>
    </>
  );

  const OrderFeedbackMessage = () => (
    <>
      {getTitle(en.orderFeedbackDetails.TITLE)}
      {getHeader()}
      <div className="feedback-msg__description">
        <p className="feedback-msg__description--primary">{en.orderFeedbackDetails.DESCRIPTION1}</p>
        <p>
          {en.orderFeedbackDetails.DESCRIPTION2}
          <strong>
            <a href={`mailto:${en.orderFeedbackDetails.SUPPORT_EMAIL}`}>{en.orderFeedbackDetails.SUPPORT_EMAIL}</a>
          </strong>
        </p>
      </div>
      <Button
        onClick={() => {
          handleFeedbackSuccessInfoBtnClick();
        }}
        color="quaternary"
        loading={isUpdatingOrder}
        className="py-4x text-left d-inline-flex align-items-center white order-rx__btn btn-new"
      >
        <span>{en.orderFeedbackDetails.BTN_MESSAGE}</span>
      </Button>
    </>
  );

  const isOrderReviewEditAllowed = review.orderReviewDetails.status === OrderStatus.PendingApproval;

  const generateFamily = (orderItems: IMappedOrderItems[]) => {
    const getFamilyName = (family: string) => {
      switch (family) {
        case 'fullFace':
          return 'The Essential Cream';
        case 'spotTreatment':
          return 'The Mighty Spot Corrector';
        case 'oralMedication':
          return 'Oral Medication';
        case 'washes':
          return 'Washes';
        default:
          return '';
      }
    };

    const getFamilyImage = (familyName: string) => {
      const productFamilyImageMap = new Map([
        ['fullFace', { imageSrc: theEssentialCreamFamily, imageAlt: 'The Essential Cream' }],
        ['spotTreatment', { imageSrc: theMightySpotCorrectorFamily, imageAlt: 'The Mighty Spot Corrector' }],
        ['oralMedication', { imageSrc: oralMedicationFamily, imageAlt: 'Oral Medication' }],
        ['washes', { imageSrc: washFamily, imageAlt: 'Wash' }],
      ]);

      const mappedImage = productFamilyImageMap.get(familyName);

      return mappedImage ? <img src={mappedImage.imageSrc} alt={mappedImage.imageAlt} /> : null;
    };

    return (
      <>
        {orderItems?.map((item, index) => {
          return (
            <div key={index} className={'container'}>
              <div className={'family-wrapper d-flex mx-neg-4x'}>
                <div className={'family-image'}>{getFamilyImage(item.productFamily)}</div>
                <div className={'family-details'}>
                  <div className={'family-name'}>{getFamilyName(item.productFamily)}</div>
                  <div className={'duration'}>{getDateRange(item.startDate, item.endDate)}</div>
                  {item?.products?.map((item, index) => {
                    return (
                      <div key={index} className={'full-name'}>
                        <a href={routes.FAQ_PRESCRIPTION_COMPOUNDS} target="_blank" rel="noreferrer">
                          {item.fullName}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <HeaderLine />
      <div className="order-review__wrapper">
        <div className="container">
          <div className="row">
            <div className="skin-conditions-image-layout__wrapper col-12-sm col-6-md">
              <div className="skin-conditions-image-layout__top-wrapper">
                <SkinConditionImageLayout
                  skinConditions={review?.skinConditions || []}
                  subtitle={review?.orderReviewDetails?.productName || ''}
                  title={en.orderReview.TITLE}
                  loading={loading}
                  content={parse(DOMPurify.sanitize(review?.orderReviewDetails?.aTPYourRX || ''))}
                  goals={review?.orderReviewDetails?.goals}
                  isFeedbackSend={isFeedbackSend}
                  setShowConditionDetails={() => setShowConditionDetails(true)}
                />
              </div>
            </div>

            <div className="order-review__detail col-12-sm col-6-md">
              {!isEditDialogOpen && !isOrderApprove && !isFeedbackSend ? (
                <>
                  <div>
                    {getTitle(en.orderReview.TITLE)}
                    <div className="skin-conditions-image-layout__body-content">
                      {loading ? <RxLoader /> : generateFamily(review?.orderItems)}
                    </div>
                  </div>
                </>
              ) : null}

              {isEditDialogOpen ? (
                <EditDialog
                  isLoading={isUpdatingOrder}
                  onSendToReveaClick={sendToRevea}
                  onClickCloseIcon={() => setIsEditDialogOpen(false)}
                  getTitle={getTitle}
                  getHeader={getHeader}
                />
              ) : null}

              {isOrderApprove ? <OrderApproveMessage /> : null}

              {isFeedbackSend ? <OrderFeedbackMessage /> : null}

              {showConditionDetails && !isFeedbackSend ? (
                <SkinConditionModal onClose={() => setShowConditionDetails(false)} />
              ) : null}
            </div>

            {!isEditDialogOpen && !isOrderApprove && !isFeedbackSend ? (
              <OrderConfirmation
                approveOrder={approveOrder}
                approveLoading={approveLoading}
                review={review}
                setIsEditDialogOpen={setIsEditDialogOpen}
                isOrderReviewEditAllowed={isOrderReviewEditAllowed}
                isEditDialogOpen={isEditDialogOpen}
                isUpdatingOrder={isUpdatingOrder}
                sendToRevea={sendToRevea}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderReview;

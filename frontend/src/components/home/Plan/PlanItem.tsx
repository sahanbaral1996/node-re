import * as React from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';
import {
  Accordion as DefaultAccordion,
  AccordionDetails,
  AccordionSummary as DefaultAccordionSummary,
  withStyles,
} from '@material-ui/core';
import ContentLoader from 'react-content-loader';

import { IPhotos, IPlan, PlanStatus, ProductFamilies } from 'types/plan';
import UploadPhoto from 'components/clinicalAssessment/UploadPhoto/UploadPhotoWrapper';
import { PhotoUploadSteps } from 'types/onboard';
import Modal from 'components/common/Modal';
import Close from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

import { formatDate } from 'utils/date';

import { en } from 'constants/lang';
import { formatType } from 'constants/dates';

import Regimen from './Regimen';
import SunScreen from './SunScreen';
import PhotoViewer from '../PhotoViewer';
import GuidanceItem from './GuidanceItem';
import GuidanceDetails from './GuidanceDetails';
import { ExpandMore } from '@material-ui/icons';
import { addPhotos } from 'assets/images';
import * as routes from 'constants/routes';
import { useHistory } from 'react-router-dom';

const Accordion = withStyles({
  root: {
    border: 'none',
    boxShadow: 'none',
  },
  expanded: {},
})(DefaultAccordion);

const HeaderItem: React.FunctionComponent<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <div className="modal__header justify-content-between">
      <IconButton style={{ height: '26px', width: '26px' }} onClick={onClose}>
        <Close />
      </IconButton>
    </div>
  );
};

const AccordionSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(DefaultAccordionSummary);

const replace = (domNode: any) => {
  domNode.attribs = {};

  return domNode;
};

const ItemLoader: React.FC = () => (
  <>
    <ContentLoader viewBox="0 0 100 10">
      <rect x="0" y="0" width="100" height="4" />
    </ContentLoader>
    <ContentLoader viewBox="0 0 100 10">
      <rect x="0" y="0" width="100" height="4" />
    </ContentLoader>
  </>
);
const ImageLoader: React.FC = () => (
  <>
    {Array(4)
      .fill(null)
      .map((_, idx) => (
        <ContentLoader width={110} height={110} viewBox="0 0 100 100" key={idx} className="mr-3x">
          <rect x="0" y="0" width="100" height="100" />
        </ContentLoader>
      ))}
  </>
);

export const PlanItemLoader: React.FC = () => (
  <div className="user-plan-item pl-8x" data-testid="plan-loader">
    <p className="user-plan-period">
      <ContentLoader viewBox="0 0 100 3">
        <rect x="0" y="0" width="20" height="2" />
      </ContentLoader>
    </p>
    <div className="user-plan-detail md-8x">
      <div className="row">
        <div className="col-8-md col-6-sm">
          <div className="row">
            <div className="col-6-md">
              <div className="user-plan-goal mb-8x">
                <ItemLoader />
              </div>
            </div>
            <div className="col-6-md">
              <ItemLoader />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-6x pr-8x">
              <ImageLoader />
            </div>
          </div>
        </div>
        <div className="col-4-md col-6-sm">
          <div className="user-plan-guidance pr-8x">
            <ItemLoader />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PHOTOS_TO_SHOW = 4;

const PlanItem: React.FC<{ plan: IPlan; status: PlanStatus; onShowDetails: (details: React.ReactNode) => void }> = ({
  plan,
  onShowDetails,
  status,
}) => {
  const [imagePopupVisible, setImagePopupVisible] = React.useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>('');
  const [uploadPhoto, setUploadPhoto] = React.useState(false);

  const history = useHistory();

  const planDateRange = (): string =>
    `${formatDate(planStartDate, formatType.SHORT_MONTH_YEAR)} - ${formatDate(
      planEndDate,
      formatType.SHORT_MONTH_YEAR
    )}`;

  const showImagePopup = (event: React.MouseEvent<HTMLElement>, id = '') => {
    setImagePopupVisible(true);
    setSelectedPhoto(id);
  };
  const hideImagePopup = () => {
    setImagePopupVisible(false);
  };

  const hideUploadModal = () => {
    setUploadPhoto(false);
    history.push(routes.HOME);
  };

  const getImageSlice = (photos: IPhotos[]): IPhotos[] =>
    photos.slice(0, Math.min(PHOTOS_TO_SHOW, photos.length)) || [];

  const planStartDate = new Date(plan.startDate);
  const planEndDate = new Date(plan.endDate);

  const getRemainingPhotos = (photos: IPhotos[]) => photos.length - PHOTOS_TO_SHOW;

  const handleStepChange = () => ({});

  const renderRegimenDetails = (productFamily: string) => {
    switch (productFamily) {
      case ProductFamilies.FullFace:
        return parse(plan?.aTPYourRX || '', { replace });
      case ProductFamilies.Wash:
        return parse(plan?.aTPYourWash || '', { replace });
      case ProductFamilies.OralMedication:
        return parse(plan?.aTPYourOralMedication || '', { replace });
      case ProductFamilies.SpotTreatment:
        return parse(plan?.aTPYourSpotTreatment || '', { replace });
      default:
        return '';
    }
  };

  return (
    <div
      className={classNames('user-plan-item', 'pl-8x', {
        'user-plan-item--active': status === PlanStatus.ACTIVE,
        'user-plan-item--disabled': status === PlanStatus.UPCOMMING,
      })}
      data-testid="plan-item"
    >
      <Accordion defaultExpanded={status === PlanStatus.ACTIVE || status === PlanStatus.UPCOMMING}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <p className="user-plan-period">{planDateRange()}</p>
        </AccordionSummary>
        <AccordionDetails>
          <div className="user-plan-detail">
            <div className="row">
              <div className="col-12-md col-6-sm">
                <div className="row">
                  <div className="col-4-lg">
                    <div className="user-plan-goal mb-8x">
                      <h3 className="mb-4x">{en.yourPlan.GOALS_TITLE}</h3>
                      <ol className="pl-6x">
                        {plan.goals
                          ? plan.goals.map((goal, index) => (
                              <li key={index} className="mb-3x">
                                {goal}
                              </li>
                            ))
                          : null}
                      </ol>
                    </div>
                  </div>
                  <div className="col-8-lg">
                    <Regimen
                      disabled={status === PlanStatus.UPCOMMING}
                      orderItems={plan.orderItems}
                      showDetails={productFamily =>
                        onShowDetails(
                          <div className="container user-plan-details">
                            <h3 className="mb-4x">{en.yourPlan.REGIMEN_TITLE}</h3>
                            <div className="user-plan-details-item">{renderRegimenDetails(productFamily)}</div>
                          </div>
                        )
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-8-lg col-6-md">
                    <div>
                      {getImageSlice(plan.photos).map((photo, idx) => (
                        <React.Fragment key={idx}>
                          {idx === PHOTOS_TO_SHOW - 1 && getRemainingPhotos(plan.photos) ? (
                            <div
                              className="plan-item__wrapper"
                              onClick={(e: React.MouseEvent<HTMLElement>) => showImagePopup(e)}
                            >
                              <img src={photo.srcUrl} className="plan-item__selfie mr-3x" />
                              <div className="plan-item__count d-flex justify-content-center align-items-center">
                                <span>+{getRemainingPhotos(plan.photos)}</span>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={photo.srcUrl}
                              className="plan-item__selfie mr-3x "
                              onClick={(e: React.MouseEvent<HTMLElement>) => showImagePopup(e, photo.id)}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div>
                      {status === PlanStatus.ACTIVE && (
                        <button
                          onClick={() => {
                            setUploadPhoto(true);
                          }}
                          className="user-plan-add-photos"
                        >
                          <div className="d-flex align-items-center font-weight-bold">
                            <AddIcon style={{ fontSize: 22 }} />
                            Add photos
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-4-lg col-6-md pl-14x-lg">
                    <div className="user-plan-guidance mt-6x mt-0x-sm">
                      {status === PlanStatus.ACTIVE ? (
                        <GuidanceItem title={en.yourPlan.DISCOVER_MORE}>
                          <ul className="pl-2x list-style-none modal-list">
                            <li className="mb-2x">
                              <GuidanceDetails
                                title={en.yourPlan.GUIDANCE_ADJUSTMENT}
                                details={[
                                  parse(plan?.aTPWhentouseyourDocentRich || '', { replace }),
                                  parse(plan?.aTPDosandDonts || '', { replace }),
                                ]}
                                onShowDetails={onShowDetails}
                              >
                                {en.yourPlan.GUIDANCE_ADJUSTMENT}
                              </GuidanceDetails>
                            </li>
                            <li className="mb-2x">
                              <GuidanceDetails
                                title={en.yourPlan.SUN_SCREEN.TITLE}
                                details={<SunScreen />}
                                onShowDetails={onShowDetails}
                              >
                                {en.yourPlan.SUN_SCREEN.TITLE}
                              </GuidanceDetails>
                            </li>
                            <li className="mb-2x">
                              <GuidanceDetails
                                title={en.yourPlan.MAKING_MOST_DETAIL_TITLE}
                                details={[parse(plan?.aTPGoodtoKnows || '', { replace })]}
                                onShowDetails={onShowDetails}
                              >
                                {en.yourPlan.MAKING_MOST}
                              </GuidanceDetails>
                            </li>
                            {plan.aTPLifestylefactorstoconsider ? (
                              <li className="mb-2x">
                                <GuidanceDetails
                                  title={en.yourPlan.GUIDANCE_TITLE}
                                  details={<>{parse(plan?.aTPLifestylefactorstoconsider || '', { replace })}</>}
                                  onShowDetails={onShowDetails}
                                >
                                  {en.yourPlan.LIFE_STYLE_GUIDANCE}
                                </GuidanceDetails>
                              </li>
                            ) : null}
                          </ul>
                        </GuidanceItem>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <div className="user-plan--border" />
      {imagePopupVisible ? (
        <PhotoViewer
          items={plan.photos.map(photo => ({
            url: photo.srcUrl,
            id: photo.id,
            time: photo.createdDate,
          }))}
          handleClose={hideImagePopup}
          id={selectedPhoto}
          heading={planDateRange()}
        />
      ) : null}
      {uploadPhoto ? (
        <>
          <Modal
            header={
              <HeaderItem
                onClose={() => {
                  setUploadPhoto(false);
                }}
              ></HeaderItem>
            }
          >
            <UploadPhoto
              onSuccess={hideUploadModal}
              showHeader={false}
              onContinue={handleStepChange}
              activeStep={PhotoUploadSteps.FacePhoto}
            />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default PlanItem;

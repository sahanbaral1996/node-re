import * as React from 'react';

import { useHistory } from 'react-router-dom';

import ImageUpload from './ImageUpload';
import ReassessmentQuestionaire from './ReassessmentQuestionaire';

import * as toast from 'utils/toast';
import { HOME } from 'constants/routes';
import { ImageFile } from 'types/common/uploadImage';
import { createReassessment as postReassessment, uploadFaceImage } from 'services/reassessment';

import {
  reassessmentInitialFormValue,
  ReassessmentFormValues,
  REASSESSMENT_STEPS,
} from './ReassessmentQuestionaire/reassessment.config';
import Button from 'components/common/button';
import HeaderLine from 'components/common/HeaderLine';
import { HomeRouterContext } from 'components/home/Router';
import useMountedRef from 'hooks/useMountedRef';
import { Language } from '@material-ui/icons';
import { en } from 'constants/lang';

enum RessessmentEnum {
  QUESTIONAIRES = 0,
  FILE_UPLOAD = 1,
  THANK_YOU_SCREEN,
}

const INITIAL_STEP = 1;

/**
 * Reassessment main component.
 */
const Reassessment: React.FC = () => {
  const history = useHistory();
  const mountRef = useMountedRef();

  const { state: userProfile } = React.useContext(HomeRouterContext);

  const [files, setFiles] = React.useState<ImageFile[]>([]);
  const [fileIds, setFileIds] = React.useState<string[]>([]);
  const [isFileUploading, setIsFileUploading] = React.useState<boolean>(false);
  const [reassessmentQuestinairePage, setReassessmentQuestionairePage] = React.useState(INITIAL_STEP);
  const [reassessmentPage, setReassessmentPage] = React.useState(RessessmentEnum.QUESTIONAIRES);
  const [reassessment, setReassessment] = React.useState<ReassessmentFormValues>(reassessmentInitialFormValue);

  // reroute to home if reassessment is not active
  React.useEffect(() => {
    if (mountRef.current) {
      if (userProfile && !userProfile?.assmtActive) {
        history.push(HOME);
      }
    }
  }, []);

  /**
   * Invoked on reassessment questionaire complete.
   *
   * @param {Object} values
   *
   * @returns {React.Component}
   */
  const setReassessmentQuestionaires = (values: ReassessmentFormValues) => {
    setReassessment(values);
    setReassessmentPage(RessessmentEnum.FILE_UPLOAD);
  };

  const handleImageUploaded = async (selectedFiles: Array<ImageFile>) => {
    const formData = new FormData();

    formData.append('attachment', selectedFiles[0]);
    formData.append('prefix', 'Selfie');

    try {
      setIsFileUploading(true);
      const response = await uploadFaceImage(formData);

      const file = selectedFiles[0];

      if (response && response.data) {
        file['id'] = response.data.salesForceContentDocumentId;
        setFiles([...files, file]);
        setFileIds([...fileIds, response.data.salesForceContentDocumentId]);
      }
    } catch (error) {
      toast.error({ title: 'Error', message: 'Image upload failed.' });
    } finally {
      setIsFileUploading(false);
    }
  };

  /**
   * Invoked when delete icon is clicked.
   *
   * @param {string} filePreview
   */
  const deleteFaceImageFile = (filePreview: string) => {
    const selectedFile = files.find(file => file.preview === filePreview) || { id: '' };

    setFiles(files.filter(file => file.preview !== filePreview));

    setFileIds(fileIds.filter((id: string) => id !== selectedFile.id));
  };

  const onSubmit = async () => {
    setIsFileUploading(true);

    const response = await createReassessment({ ...reassessment, selfies: fileIds });

    setIsFileUploading(true);

    if (response && response.errors) {
      toast.error({
        title: 'Error',
        message: response.errors.message,
      });

      return;
    }

    setReassessmentPage(RessessmentEnum.THANK_YOU_SCREEN);
  };

  const createReassessment = (data: any) => {
    try {
      return postReassessment(data);
    } catch (error) {
      toast.error({
        title: 'Error',
        message: error,
      });
    }
  };

  const handleBackClick = () => {
    setReassessmentQuestionairePage(REASSESSMENT_STEPS.length);
    setReassessmentPage(RessessmentEnum.QUESTIONAIRES);
  };

  switch (reassessmentPage) {
    case RessessmentEnum.QUESTIONAIRES:
      return (
        <ReassessmentQuestionaire
          reassessment={reassessment}
          initialStep={reassessmentQuestinairePage}
          reassessmentInitialFormValue={reassessmentInitialFormValue}
          onSubmit={setReassessmentQuestionaires}
        />
      );
    case RessessmentEnum.FILE_UPLOAD:
      return (
        <ImageUpload
          files={files}
          onSubmit={onSubmit}
          isLoading={isFileUploading}
          handleBackClick={handleBackClick}
          deleteFaceImageFile={deleteFaceImageFile}
          handleImageUploaded={handleImageUploaded}
        />
      );
    case RessessmentEnum.THANK_YOU_SCREEN:
      return (
        <>
          <HeaderLine />
          <div className="standalone-OC-container pt-12x">
            <div className="container content">
              <div className="OC__container mx-auto text-center">
                <p className="OC__title">{en.thankYouScreen.TITLE}</p>
                <p className="OC__description mb-8x">{en.thankYouScreen.DESCRIPTION}</p>
                <Button color="quaternary" className="order-confirmed__btn" onClick={() => history.push(HOME)}>
                  <span>{en.thankYouScreen.BUTTON}</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      );

    default:
      return <>Not found</>;
  }
};

export default Reassessment;

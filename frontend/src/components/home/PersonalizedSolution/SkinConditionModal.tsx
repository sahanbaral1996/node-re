import * as React from 'react';

import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import Modal from 'components/common/Modal';

import { handleError } from 'utils/errorHandler';
import { fetchSkinConditionDetails } from 'services/skinConditionModal';
import ModalContentLoader from 'components/common/contentLoaders/ModalContentLoader';

interface SkinConditionInterface {
  onClose: () => void;
}

interface SkinConditionDetails {
  details: string;
}

const INITIAL_DETAILS = {
  details: '',
};

const SkinConditionModal: React.FC<SkinConditionInterface> = ({ onClose }) => {
  const [skinConditionDetails, setSkinConditionDetails] = React.useState<SkinConditionDetails>(INITIAL_DETAILS);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const {
          data: { data },
        } = await fetchSkinConditionDetails();

        setSkinConditionDetails(data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Modal isClose={onClose} className="skin-condition__modal">
      {isLoading ? (
        <ModalContentLoader />
      ) : (
        <div className="skin-condition__details">{parse(DOMPurify.sanitize(skinConditionDetails.details))}</div>
      )}
    </Modal>
  );
};

export default SkinConditionModal;

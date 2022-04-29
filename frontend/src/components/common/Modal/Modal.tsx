import * as React from 'react';

import classNames from 'classnames';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { ModalProps } from 'types/common/modal';

const Modal: React.FC<ModalProps> = ({ children, isClose, header, className = '' }) => {
  React.useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <>
      <div className="overshadow-background" onClick={isClose}></div>
      <div className={classNames(className, 'modal__wrapper')}>
        {header ? (
          header
        ) : isClose ? (
          <div className="modal__header justify-content-end">
            <IconButton style={{ height: '26px', width: '26px' }} onClick={isClose}>
              <Close />
            </IconButton>
          </div>
        ) : null}
        <div className="modal__container">{children}</div>
      </div>
    </>
  );
};

export default Modal;

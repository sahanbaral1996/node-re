import React from 'react';

import Button from '../button';

import { warningIcon } from 'assets/images';
import { WarningDialogProps } from 'types/common/warningDialog';

/**
 * WarningDialog common Component.
 *
 * @param {Object} props
 *
 * @returns {React.Component}
 */
const WarningDialog: React.FunctionComponent<WarningDialogProps> = props => {
  const { customBody, children, title, description, onSubmitClick } = props;

  return (
    <>
      <div className="overshadow-background"></div>
      <div className="warning-dialog__wrapper">
        {customBody ? (
          customBody
        ) : (
          <React.Fragment>
            <div className="warning-dialog__body">
              <h3 className="warning-dialog__title">{title}</h3>
              <p className="warning-dialog__description">{description}</p>
              {children}
            </div>
            <Button color="transparent" title="CLOSE" onClick={onSubmitClick} />
          </React.Fragment>
        )}
      </div>
    </>
  );
};

WarningDialog.defaultProps = {
  description: '',
  onSubmitClick: () => {},
};

export default WarningDialog;

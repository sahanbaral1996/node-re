import * as React from 'react';

import SkinConditions from 'components/common/TreatmentSummary/SkinConditions';

import { SkinConditionImageLayoutProps } from 'types/common/skinConditionImageLayout';

/**
 * Order review main component.
 */
const SkinConditionImageLayout: React.FunctionComponent<SkinConditionImageLayoutProps> = ({
  loading,
  skinConditions,
  goals,
  isFeedbackSend,
  setShowConditionDetails,
}) => {
  return (
    <div className="skin-conditions-image-layout__card">
      <SkinConditions
        isLoading={loading}
        skinConditions={skinConditions}
        setShowConditionDetails={setShowConditionDetails}
        goals={goals}
        isFeedbackSend={isFeedbackSend}
      />
    </div>
  );
};

export default SkinConditionImageLayout;

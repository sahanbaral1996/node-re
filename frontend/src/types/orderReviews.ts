import React from 'react';
export interface EditDialogForm {
  description: string;
}

export interface EditDialogProps {
  isLoading: boolean;
  onSendToReveaClick: (values: EditDialogForm) => void;
  onClickCloseIcon: () => void;
  getTitle: (title: string) => React.ReactElement;
  getHeader: () => React.ReactElement;
}

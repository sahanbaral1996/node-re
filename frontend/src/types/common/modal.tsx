import * as React from 'react';
export interface ModalProps {
  children?: any;
  isClose?: () => void;
  className?: string;
  header?: React.ReactNode;
}

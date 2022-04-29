import { ReactNode } from 'react';

export interface WarningDialogProps {
  title?: string;
  description?: string;
  onSubmitClick?: () => void;
  children?: ReactNode | ReactNode[];
  customBody?: ReactNode | ReactNode[];
}

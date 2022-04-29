import { ChangeEvent, ReactNode } from 'react';

export interface ReveaCheckboxProps {
  name: string;
  label: string | ReactNode;
  onChange: (e: ChangeEvent<any>) => void;
  checked?: boolean;
}

import { ChangeEvent } from 'react';

export interface ReveaSelectProps {
  value: string | number;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  errorMessage?: string;
  onChange: (e: ChangeEvent<any>) => void;
}

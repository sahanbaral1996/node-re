import * as React from 'react';

export interface ReveaInputProps {
  value?: string | number;
  name: string;
  type?: string;
  label: string;
  isError?: boolean;
  placeholder?: string;
  errorMessage?: React.ReactNode;
  onChange: (e: React.ChangeEvent<any>) => void;
  tooltip?: string;
  disabled?: boolean;
}

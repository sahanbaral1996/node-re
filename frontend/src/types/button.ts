import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'transparent'
  | 'tertiary'
  | 'accent'
  | 'secondary-new'
  | 'quaternary'
  | 'ghost'
  | 'black-text'
  | 'quinary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  color?: ButtonColor;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode | ReactNode[];
  loading?: boolean;
}

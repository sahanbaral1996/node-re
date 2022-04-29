import React from 'react';
import classNames from 'classnames';

import { ButtonProps } from 'types/button';

import ClipLoader from 'react-spinners/ClipLoader';

const Button: React.FC<ButtonProps> = ({
  title,
  color = 'primary',
  fullWidth = false,
  className = '',
  children,
  loading = false,
  ...rest
}) => {
  const buttonClass = classNames(className, {
    btn: true,
    'btn-primary': color === 'primary',
    'btn-gray': color === 'secondary',
    'btn-tertiary': color === 'tertiary',
    'btn-transparent': color === 'transparent',
    'btn-accent': color === 'accent',
    'btn-block': fullWidth,
    disabled: rest.disabled,
    'btn-secondary': color === 'secondary-new',
    'btn-quaternary': color === 'quaternary',
    'btn-quinary': color === 'quinary',
    'btn-ghost': color === 'ghost',
    'btn-black-text': color === 'black-text',
  });

  if (loading) {
    return (
      <button
        {...rest}
        className={buttonClass}
        style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <span>{title}</span>
        <span>{children}</span>
        <span data-testid="clip-loader" style={{ marginLeft: '24px' }}>
          <ClipLoader loading={true} size={18} color="white" />
        </span>
      </button>
    );
  }

  return (
    <button className={buttonClass} {...rest}>
      {title}
      {children}
    </button>
  );
};

export default Button;

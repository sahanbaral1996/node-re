import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  value: any;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, value, ...rest }) => {
  return (
    <>
      <label htmlFor={name} className="textarea__label">
        {label}
      </label>
      <textarea name={name} value={value} {...rest}></textarea>
    </>
  );
};

export default Textarea;

import React from "react";

interface Props {
  ref: React.RefObject<HTMLInputElement>;
  type: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({ ref, type, placeholder, onChange }) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;

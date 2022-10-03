import React, { forwardRef } from "react";
import useInput from "../../../hooks/useInput";

interface Props {
  ref: React.RefObject<HTMLInputElement>;
  type: string;
  name: string;
  placeholder: string;
  onChange: (value: string) => boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ type, name, placeholder, onChange }, ref) => {
    const {
      value,
      isValid,
      hasError,
      valueChangeHandler,
      inputBlurHandler,
      reset,
    } = useInput(onChange);

    return (
      <div className="input">
        <label className="input-label" htmlFor="name">
          {name}
        </label>
        <input
          id="name"
          ref={ref}
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={valueChangeHandler}
          onBlur={inputBlurHandler}
          className="input-field"
        />
      </div>
    );
  }
);

export default Input;

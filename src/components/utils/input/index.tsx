import React, { forwardRef, useEffect } from "react";
import useInput from "../../../hooks/useInput";

interface Props {
  ref: React.RefObject<HTMLInputElement>;
  type: string;
  name: string;
  placeholder: string;
  errorMessage: string;
  manageText: boolean;
  validate: (value: string) => boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ type, name, placeholder, errorMessage, validate, manageText }, ref) => {
    // const {
    //   value,
    //   isValid,
    //   hasError,
    //   valueChangeHandler,
    //   inputBlurHandler,
    //   reset,
    // } = useInput(validate);

    // useEffect(() => {
    //   if (manageText) {
    //     reset();
    //   }
    // }, [manageText]);
    return (
      <div className="input">
        <label className="input-label" htmlFor={name}>
          {name}
        </label>
        <input
          id={name}
          ref={ref}
          //   value={value}
          //   type={type}
          //   placeholder={placeholder}
          //   onChange={valueChangeHandler}
          //   onBlur={inputBlurHandler}
          //   className={`input-field ${
          //     hasError
          //       ? "input-field--invalid"
          //       : isValid
          //       ? "input-field--valid"
          //       : ""
          //   }`}
        />
        {/* {hasError && <div className="error-message">{errorMessage}</div>} */}
      </div>
    );
  }
);

Input.displayName = "CustomInput";
export default Input;

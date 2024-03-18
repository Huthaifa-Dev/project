import { useState } from "react";

const useInput = (validate: (value: string) => boolean) => {
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validate(inputValue);
  const hasError = !isValid && isTouched;

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setInputValue("");
    setIsTouched(false);
  };

  const attributes: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    reset: () => void;
    hasError: boolean;
  } = {
    value: inputValue,
    onChange: valueChangeHandler,
    onBlur: inputBlurHandler,
    reset,
    hasError,
  };
  return attributes;
};

export default useInput;

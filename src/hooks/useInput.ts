import { useState } from "react";

const useInput = (validate: (value: string) => boolean) => {
  const [value, setValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValid = validate(value);
  const hasError = !isValid && isTouched;

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setValue("");
    setIsTouched(false);
  };

  const attributes: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    reset: () => void;
    hasError: boolean;
  } = {
    value,
    onChange: valueChangeHandler,
    onBlur: inputBlurHandler,
    reset,
    hasError,
  };
  return attributes;
};

export default useInput;

import { useState } from "react";

const useInput = (validate:(value:string)=>boolean) => {
    const [value, setValue] = useState("");
    const [isTouched, setIsTouched] = useState(false);
    
    const valueIsValid = validate(value);
    const hasError = !valueIsValid && isTouched;
    
    const valueChangeHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(event){
            setValue(event.target.value);
        }
    };
    
    const inputBlurHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
        setIsTouched(true);
    };
    
    const reset = () => {
        setValue("");
        setIsTouched(false);
    };
    
    return {
        value,
        isValid: valueIsValid,
        hasError,
        valueChangeHandler,
        inputBlurHandler,
        reset,
    };
}

export default useInput;
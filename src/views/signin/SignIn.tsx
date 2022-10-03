import React, { ChangeEvent, useState } from "react";
import { Button } from "../../components/utils/Button/Button";
import useInput from "../../hooks/useInput";
import useLocalStorage from "../../hooks/useLocalStorage";
import Blank from "../../layout/Blank";
import "./SignIn.scss";
import { passwordValidation, userValidation } from "./validations";

export const SignIn: React.VFC = () => {
  const [rememberMe, setRememberMe] = useState<string>("off");
  // const [user, setUser] = useLocalStorage<User>("user", "");

  const {
    value: userName,
    onChange: changeUserName,
    onBlur: blurUserName,
    reset: userReset,
    hasError: userNameHasError,
  } = useInput(userValidation);
  const {
    value: password,
    onChange: changePassword,
    onBlur: blurPassword,
    reset: passwordReset,
    hasError: passwordHasError,
  } = useInput(passwordValidation);

  const handleRememberMe = (event: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.value);
  };
  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userNameHasError || passwordHasError) {
      return;
    }
    userReset();
    passwordReset();
  };

  const userErrorMessage = (value: string) => {
    if (value.length === 0) {
      return "Username is required";
    } else if (value.length < 4) {
      return "Username must be at least 4 characters long";
    } else {
      return "";
    }
  };
  const passErrorMessage = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
    if (value.length === 0) {
      return "Password is required";
    } else if (value.length < 4) {
      return "Password must be at least 4 characters long";
    } else if (!regex.test(value)) {
      return "Password must contain at least one uppercase letter, one lowercase letter and one number";
    } else {
      return "";
    }
  };
  return (
    <Blank>
      <div className="signin">
        <h1 className="signin__title">
          Sign In<span>👋</span>
        </h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="username">User Name</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={changeUserName}
              onBlur={blurUserName}
              className={`form-control ${
                userNameHasError ? "form-control--error" : ""
              }`}
            />
            <div className="error-message">
              {userNameHasError && userErrorMessage(userName)}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={changePassword}
              onBlur={blurPassword}
              className={`form-control ${
                passwordHasError ? "form-control--error" : ""
              }`}
            />
            <div className="error-message">
              {passwordHasError && passErrorMessage(password)}
            </div>
          </div>
          <div className="form-group check-box">
            <input
              id="remember"
              type="checkbox"
              onChange={handleRememberMe}
              value={rememberMe}
            />
            <label htmlFor="remember">Remember Me?</label>
          </div>
          <Button primary label="Login" fullWidth size="large" type="submit" />
        </form>
      </div>
    </Blank>
  );
};

export default SignIn;

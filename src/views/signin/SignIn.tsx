import React from "react";
import "./SignIn.css";

type User = {
  name: string;
};

export const SignIn: React.VFC = () => {
  const [user, setUser] = React.useState<User>();

  return (
    <div className="wrapper">
      <div className="body">
        <form>
          <label htmlFor="name">
            Username:
            <input
              id="id"
              name="name"
              type="text"
              placeholder="Enter your username"
              required
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

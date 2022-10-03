import React from "react";
import Blank from "../../layout/Blank/Blank";
import "./SignIn.css";

type User = {
  name: string;
};

export const SignIn: React.VFC = () => {
  const [user, setUser] = React.useState<User>();

  return (
    <Blank>
      <form>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
      </form>
    </Blank>
  );
};

export default SignIn;

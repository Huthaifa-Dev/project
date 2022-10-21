import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { RootState } from "../../redux";
import { User } from "../../types";

import "./Horizantal.scss";

interface Props {
  children: React.ReactNode;
}

const Blank: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const userStore = useSelector<RootState, Partial<User>>(
    (state) => state.user
  );
  const onLogin = () => {
    navigate("/sign-in");
  };
  const onLogout = () => {
    navigate("/sign-in");
  };

  return (
    <div className="horizantal-layout">
      <Header user={userStore} onLogin={onLogin} onLogout={onLogout} />
      <div className="horizantal-layout__content">
        <div className="background"></div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Blank;

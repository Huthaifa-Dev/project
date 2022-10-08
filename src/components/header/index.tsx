import React from "react";
import { useDispatch } from "react-redux";
import useLocalStorage from "../../hooks/useLocalStorage";
import { userLogout } from "../../redux/slices/userSlice";
import { User } from "../../types";
import HeaderComponent from "./HeaderComponent";

interface HeaderProps {
  user?: Partial<User>;
  onLogin: () => void;
  onLogout: () => void;
}

const Header = ({ user, onLogin, onLogout }: HeaderProps) => {
  const dispatch = useDispatch();
  console.log(user);
  const [localUser, setLocalUser] = useLocalStorage("user", null);
  const onLogoutHandler = () => {
    dispatch(userLogout());
    setLocalUser(null);
    onLogout();
  };
  const onLoginHandler = () => {
    onLogin();
  };
  return (
    <HeaderComponent
      onLogin={onLoginHandler}
      onLogout={onLogoutHandler}
      user={user}
    />
  );
};
export default Header;

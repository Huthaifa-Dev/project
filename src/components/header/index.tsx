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
  const [localUser, setLocalUser] = useLocalStorage("localUser", null);
  const [storageUser, setStorageUser] = useLocalStorage("user", null);
  const onLogoutHandler = () => {
    dispatch(userLogout());
    setLocalUser(null);
    setStorageUser(null);
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

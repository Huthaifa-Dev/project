import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { selectUser } from "../redux/slices/userSlice";

interface Props {
  children: React.ReactElement | null;
}
const PrivateRoute: React.VFC<Props> = ({ children }) => {
  const [user, setUser] = useLocalStorage("localUser", null);

  return user.role ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

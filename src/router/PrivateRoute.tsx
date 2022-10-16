import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slices/userSlice";

interface Props {
  children: React.ReactElement<any, any> | null;
}
const PrivateRoute: React.VFC<Props> = ({ children }) => {
  const { user } = useSelector(selectUser);
  return user.role ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

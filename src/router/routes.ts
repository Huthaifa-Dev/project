import { RouteObject, useRoutes } from "react-router-dom";
import SignIn from "../views/signin/SignIn";

const PageRoutes = () => {
  const routes: RouteObject[] = [
    {
      path: "/signin",
      element: typeof SignIn,
    },
  ];
  return useRoutes(routes);
};

export default PageRoutes;

import { RouteObject, useRoutes } from "react-router-dom";
import SignInPage from "../views/signin/";

const PageRoutes = () => {
  const routes: RouteObject[] = [
    {
      path: "/signin",
      element: typeof SignInPage,
    },
  ];
  return useRoutes(routes);
};

export default PageRoutes;

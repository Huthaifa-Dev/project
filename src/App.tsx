import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux";
import { userLogin } from "./redux/slices/userSlice";
import useLocalStorage from "./hooks/useLocalStorage";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./router/PrivateRoute";
const SignInPage = lazy(() => import("./views/signin/index"));
const CategoriesPage = lazy(() => import("./views/categories/index"));
const ProductsPage = lazy(() => import("./views/products/index"));
const ProductsEditPage = lazy(() => import("./views/product-edittor/index"));
const Home = lazy(() => import("./views/home/Home"));
const Loading = lazy(() => import("./components/utils/Loading/LoadingPage"));
const App: React.FC = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useLocalStorage("user", null);
  useEffect(() => {
    if (user) {
      dispatch(
        userLogin({ id: user.id, username: user.fullName, role: user.role })
      );
    }
  }, []);
  return (
    <Provider store={store}>
      <div>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ProductsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/:productId/edit"
              element={
                <PrivateRoute>
                  <ProductsEditPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <CategoriesPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </div>
    </Provider>
  );
};

export default App;

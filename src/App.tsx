import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./redux";
import useLocalStorage from "./hooks/useLocalStorage";
import toast, { Toaster } from "react-hot-toast";
import PrivateRoute from "./router/PrivateRoute";
import useLogin from "./hooks/useLogin";
import Horizantal from "./layout/Horizantal/";
import { getCategories } from "./redux/slices/categorySlice";
import { getProducts } from "./redux/slices/productSlice";
import { getCarts } from "./redux/slices/cartSlice";
const SignInPage = lazy(() => import("./views/signin/index"));
const CategoriesPage = lazy(() => import("./views/categories/index"));
const ProductsPage = lazy(() => import("./views/products/index"));
const ProductsEditPage = lazy(() => import("./views/product-edittor/index"));
const Home = lazy(() => import("./views/home/Home"));
const Loading = lazy(() => import("./components/utils/Loading/LoadingPage"));
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [localUser, setLocalUser] = useLocalStorage("localUser", null);
  const [user, setUser] = useLogin();
  useEffect(() => {
    if (localUser) {
      setUser();
      // navigate("/home");
    }
    const promise = Promise.all([
      dispatch(getCategories()),
      dispatch(getProducts()),
      dispatch(getCarts()),
    ]);
    toast.promise(
      promise,
       {
      loading: "Loading Data...",
      success: "Data Loaded",
      error: "Error",
    });
  }, []);
  return (
    <Provider store={store}>
      <div>
        <Suspense
          fallback={
            <Horizantal>
              <Loading />
            </Horizantal>
          }
        >
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
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

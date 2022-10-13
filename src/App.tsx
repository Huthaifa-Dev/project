import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
const SignInPage = lazy(() => import("./views/signin/index"));
const CategoriesPage = lazy(() => import("./views/categories/index"));
const ProductsPage = lazy(() => import("./views/products/index"));
import Home from "./views/home/Home";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux";
import { userLogin } from "./redux/slices/userSlice";
import useLocalStorage from "./hooks/useLocalStorage";
import { Toaster } from "react-hot-toast";
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
        <Suspense fallback={<Home>Loading</Home>}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId/edit" element={<Home />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </div>
    </Provider>
  );
};

export default App;

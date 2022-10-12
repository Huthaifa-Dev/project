import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "./views/signin/";
import CategoriesPage from "./views/categories/";
import ProductsPage from "./views/products/";
import Home from "./views/home/Home";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux";
import { userLogin } from "./redux/slices/userSlice";
import useLocalStorage from "./hooks/useLocalStorage";
import toast, { Toaster } from "react-hot-toast";
const App: React.FC = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useLocalStorage("user", null);
  useEffect(() => {
    if (user && user.id !== 0) {
      dispatch(
        userLogin({ id: user.id, username: user.fullName, role: user.role })
      );
    }
  }, []);
  return (
    <Provider store={store}>
      <div>
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId/edit" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
        <Toaster position="bottom-center" />
      </div>
    </Provider>
  );
};

export default App;

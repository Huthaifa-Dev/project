import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./views/signin/SignIn";
import { Provider } from "react-redux";
import { store } from "./redux";
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <Routes>
          <Route path="/" element={<Navigate replace to="/sign-in" />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/products" element={<></>} />
          <Route path="/categories" element={<></>} />
        </Routes>
      </div>
    </Provider>
  );
};

export default App;

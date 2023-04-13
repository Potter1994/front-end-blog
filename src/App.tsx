import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  setUserIsLogin,
  setUserInfo,
  setErrorMessage,
} from "./redux/reducers/userSlice";
import { useAppDispatch } from "./redux/store";
import { useLocation } from "react-router-dom";

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("potterSiteUserInfo") as string
      );

      if (userInfo?.username) {
        dispatch(setUserIsLogin(true));
        dispatch(setUserInfo(userInfo));
      }
    } catch (err) {
      localStorage.removeItem("potterSiteUserInfo");
    }
  }, []);

  useEffect(() => {
    dispatch(setErrorMessage(""));
  }, [location.pathname]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

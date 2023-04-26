import { useEffect } from "react";
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
  selectUser,
} from "./redux/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { useLocation } from "react-router-dom";
import ArticlePopup from "./components/ArticlePopup";
import Chatroom from "./components/Chatroom";
import { axiosGetChatroom } from "./utils/useAPI";
import {
  setChatuser,
  setToken,
  setUsername,
} from "./redux/reducers/messageSlice";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const message = useAppSelector((state) => state.message);
  const location = useLocation();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("potterSiteUserInfo") as string
      );

      if (userInfo?.username) {
        dispatch(setUserIsLogin(true));
        dispatch(setUserInfo(userInfo));

        if (localStorage.getItem("potterSiteChatInfo")) {
          const { chatuser, token } = JSON.parse(
            localStorage.getItem("potterSiteChatInfo") as string
          );

          dispatch(
            setUsername(
              chatuser.find((name: string) => name !== userInfo.username)
            )
          );
          dispatch(setChatuser(chatuser));
          dispatch(setToken(token));
        }
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
        <Route path='/' element={<Home />}>
          <Route path='article/:id' element={<ArticlePopup />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <Footer />
      {user.userInfo?.username && message.username && <Chatroom />}
    </div>
  );
}

export default App;

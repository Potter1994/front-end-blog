import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { selectUser, logoutUser } from "../redux/reducers/userSlice";
import { setIsOpen } from "../redux/reducers/notificationSlice";
import {
  getNotificationAction,
  updateNotificationAction,
} from "../redux/sagas/action";
import NotificationList from "./NotificationList";
import { socket } from "../socket";

function Header() {
  const user = useAppSelector(selectUser);
  const notification = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  function updateNotification(e: string) {
    const echoRes = JSON.parse(e);
    console.log(echoRes);
    const { chatuser, username, content } = echoRes;
    const myInfo = {
      username: user.userInfo?.username,
    };

    if (myInfo.username === chatuser || myInfo.username === username) {
      console.log("hhsss");
      dispatch(updateNotificationAction({ chatuser, content, username }));
    }
  }

  useEffect(() => {
    dispatch(getNotificationAction());
    socket.on("chatMessage", updateNotification);

    return () => {
      socket.off("chatMessage", updateNotification);
    };
  }, [user.userIsLogin]);

  const guestHeader = (
    <nav className='header-right'>
      <NavLink to='/register' className='header__link mr-2'>
        Register
      </NavLink>
      <NavLink to='/login' className='header__link'>
        Login
      </NavLink>
    </nav>
  );

  const userHeader = (
    <nav className='header-right flex items-center'>
      <div
        onClick={() => dispatch(setIsOpen(!notification.isOpen))}
        className='notification-button w-10 h-10 bg-white flex mr-4 cursor-pointer rounded-full hover:bg-blue-300 relative justify-center'>
        <img className='w-8' src={`/src/assets/bell.svg`} />
        {notification?.isOpen && <NotificationList />}
        {notification.hasNew && (
          <div className='bg-red-500 absolute w-4 h-4 rounded-full right-0'></div>
        )}
      </div>
      <NavLink
        to='/logout'
        className='header__link'
        onClick={(e) => handleLogout(e)}>
        Logout
      </NavLink>
    </nav>
  );

  return (
    <div className='header'>
      <nav className='header-left'>
        <NavLink to='/' className='header__link'>
          Home
        </NavLink>
      </nav>
      {user.userIsLogin ? userHeader : guestHeader}
    </div>
  );
}

export default Header;

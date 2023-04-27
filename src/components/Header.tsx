import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { selectUser, logoutUser } from "../redux/reducers/userSlice";
import { setIsOpen } from "../redux/reducers/notificationSlice";
import NotificationList from "./NotificationList";

function Header() {
  const user = useAppSelector(selectUser);
  const notification = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  useEffect(() => {
    console.log(notification);
  }, []);

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
        className='w-10 h-10 bg-white flex mr-4 cursor-pointer rounded-full hover:bg-blue-300 relative'>
        <img className='w-full' src='/src/assets/bell.svg' />
        {notification?.isOpen && <NotificationList />}
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

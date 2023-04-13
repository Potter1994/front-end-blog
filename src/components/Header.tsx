import React from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { selectUser, logoutUser } from "../redux/reducers/userSlice";

function Header() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

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
    <nav className='header-right'>
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

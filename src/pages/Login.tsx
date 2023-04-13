import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  selectUser,
  setErrorMessage,
  loginUser,
} from "../redux/reducers/userSlice";

function Login() {
  const [passwordType, setPasswordType] = useState(true);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const handleLogin = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;

    if (!username || !password) {
      console.log(user);
      return dispatch(setErrorMessage("請輸入完整資料"));
    }

    // if (password.length < 6) {
    //   return dispatch(setErrorMessage("密碼小於 6 碼"));
    // }

    dispatch(loginUser(navigate, username, password));
  };

  return (
    <form className='form' onSubmit={(e) => handleLogin(e)}>
      <h2 className='form-title'>Login</h2>
      <div className='form-fields'>
        <label className='form-label'>
          <p className='form-label__text'>Username :</p>
          <div className='form-label__wrapper'>
            <input type='text' className='form-input' ref={usernameRef} />
          </div>
        </label>
        <label className='form-label'>
          <p className='form-label__text'>Password :</p>
          <div className='form-label__wrapper'>
            <input
              type={passwordType ? "password" : "text"}
              className='form-input'
              ref={passwordRef}
            />
            <i
              className='form-eye-icon'
              onClick={() => setPasswordType((prev) => !prev)}>
              <img
                src={`/src/assets/eye-${passwordType ? "open" : "closed"}.svg`}
              />
            </i>
          </div>
        </label>
      </div>
      {user.errorMessage && <p className='form-error'>{user.errorMessage}</p>}
      <div className='form-bottom'>
        <button className='form-button confirm'>Login</button>
        <button className='form-button cancel'>Cancel</button>
      </div>
    </form>
  );
}

export default Login;

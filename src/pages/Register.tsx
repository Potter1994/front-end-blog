import React, { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/store";
import {
  createUser,
  selectUser,
  setErrorMessage,
} from "../redux/reducers/userSlice";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

function Register() {
  const [passwordType, setPasswordType] = useState(true);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    const username = usernameRef.current!.value?.trim();
    const password = passwordRef.current!.value;
    const confirm = confirmRef.current!.value;

    if (!username || !password || !confirm) {
      return dispatch(setErrorMessage("請完整填寫"));
    }

    if (password.length < 6) {
      return dispatch(setErrorMessage("密碼少於 6 碼"));
    }

    if (password !== confirm) {
      return dispatch(setErrorMessage("確認密碼錯誤"));
    }

    dispatch(createUser(navigate, username, password));
  };

  return (
    <form className='form' onSubmit={(e) => handleSubmit(e)}>
      {user.isLoading && <Loading />}
      <h2 className='form-title'>Register</h2>
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
          </div>
        </label>
        <label className='form-label'>
          <p className='form-label__text'>Confirm Password :</p>
          <div className='form-label__wrapper'>
            <input
              type={passwordType ? "password" : "text"}
              className='form-input'
              ref={confirmRef}
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
        <button className='form-button confirm'>Register</button>
        <button className='form-button cancel'>Cancel</button>
      </div>
    </form>
  );
}

export default Register;

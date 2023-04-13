import { fetchRegister, fetchLogin } from './../../utils/useAPI';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import { NavigateFunction } from 'react-router-dom';

type UserInfo = {
  username: string;
  token: string;
}

interface UserState {
  isLoading: boolean;
  userIsLogin: boolean;
  userInfo: null | UserInfo;
  errorMessage: string;
}

const initialState: UserState = {
  isLoading: false,
  userIsLogin: false,
  userInfo: null,
  errorMessage: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading: (state, action: { payload: boolean }) => ({ ...state, isLoading: action.payload }),
    setUserIsLogin: (state, action: { payload: boolean }) => ({ ...state, userIsLogin: action.payload }),
    setUserInfo: (state, action: { payload: null | UserInfo }) => ({ ...state, userInfo: action.payload }),
    setErrorMessage: (state, action: { payload: string }) => ({ ...state, errorMessage: action.payload }),
  }
})

export const { setIsLoading, setUserInfo, setUserIsLogin, setErrorMessage } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;

export const createUser = (navigate: NavigateFunction, username: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setErrorMessage(''));
  dispatch(setIsLoading(true));

  try {
    const result = await fetchRegister(username, password);
    dispatch(setIsLoading(false));

    if (result.errorMessage) {
      return dispatch(setErrorMessage(result.errorMessage))
    }

    localStorage.setItem('potterSiteUserInfo', JSON.stringify(result.user));
    dispatch(setUserIsLogin(true));
    dispatch(setUserInfo(result.user))
    navigate('/');
  } catch (err) {
    dispatch(setErrorMessage('Server Error'))
    dispatch(setIsLoading(false));
    dispatch(setUserIsLogin(false));
    dispatch(setUserInfo(null));
    localStorage.removeItem('potterSiteUserInfo');
  }
}

export const loginUser = (navigate: NavigateFunction, username: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setErrorMessage(''));
  dispatch(setIsLoading(true));

  try {
    const result = await fetchLogin(username, password);
    dispatch(setIsLoading(false));


    if (result.errorMessage) {
      return dispatch(setErrorMessage(result.errorMessage))
    };

    localStorage.setItem('potterSiteUserInfo', JSON.stringify(result.user));
    dispatch(setUserIsLogin(true));
    dispatch(setUserInfo(result.user));
    navigate('/');
  } catch (err) {
    dispatch(setErrorMessage('Server Error'))
    dispatch(setIsLoading(false));
    dispatch(setUserIsLogin(false));
    dispatch(setUserInfo(null));
    localStorage.removeItem('potterSiteUserInfo');
  }
}

export const logoutUser = () => async (dispatch: AppDispatch) => {
  localStorage.removeItem("potterSiteUserInfo");
  dispatch(setErrorMessage(''));
  dispatch(setIsLoading(false));
  dispatch(setUserInfo(null));
  dispatch(setUserIsLogin(false));
}
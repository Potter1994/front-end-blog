import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: [],
  isLoading: false,
  hasNew: false,
  isOpen: false,
  errorMessage: '',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotificationAxios: (state) => { state.errorMessage = 'hhh' },
    setNotification: (state, action) => ({ ...state, notification: action.payload }),
    setIsLoading: (state, action) => ({ ...state, isLoading: action.payload }),
    setHasNew: (state, action) => ({ ...state, hasNew: action.payload }),
    setIsOpen: (state, action) => ({ ...state, isOpen: action.payload }),
    setErrorMessage: (state, action) => ({ ...state, errorMessage: action.payload }),
  }
});

export const { setNotification, setIsLoading, setHasNew, setIsOpen, setErrorMessage, getNotificationAxios } = notificationSlice.actions;
export default notificationSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: [],
  isLoading: false,
  hasNew: false,
  isOpen: false,
  webMessage: {} as any,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => ({ ...state, notification: action.payload }),
    setIsLoading: (state, action) => ({ ...state, isLoading: action.payload }),
    setHasNew: (state, action) => ({ ...state, hasNew: action.payload }),
    setIsOpen: (state, action) => ({ ...state, isOpen: action.payload }),
    setWebMessage: (state, action) => ({ ...state, webMessage: action.payload }),
  }
});

export const { setNotification, setIsLoading, setHasNew, setIsOpen, setWebMessage } = notificationSlice.actions;
export default notificationSlice.reducer;
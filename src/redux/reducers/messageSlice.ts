import { axiosGetChatroom, axiosSetChatConfig, axiosGetMessage, axiosPostMessage } from './../../utils/useAPI';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch, store } from '../store';

enum uploadStatus {
  fail = 0,
  success = 1,
  uploading = 2,
}

type Message = {
  username: string,
  content: string,
  timestamp: Date,
  message_id: number,
  upload: uploadStatus,
}

interface MessageState {
  username: string;
  isLoading: boolean;
  currentMessage: Message[];
  isRead: boolean;
  chatuser: string[];
  token: string;
}

const initialState: MessageState = {
  username: '',
  isLoading: false,
  currentMessage: [],
  isRead: false,
  chatuser: [],
  token: '',
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setUsername: (state, action) => ({ ...state, username: action.payload }),
    setIsLoading: (state, action) => ({ ...state, isLoading: action.payload }),
    setIsRead: (state, action) => ({ ...state, isRead: action.payload }),
    setCurrentMessage: (state, action) => ({ ...state, currentMessage: action.payload }),
    setChatuser: (state, action) => ({ ...state, chatuser: action.payload }),
    setToken: (state, action) => ({ ...state, token: action.payload }),
    setReset: (state, action) => (initialState),
  }
})

export const { setUsername, setIsLoading, setIsRead, setCurrentMessage, setChatuser, setToken, setReset } = messageSlice.actions;
export default messageSlice.reducer;

export const getChatroom = (chatuser: string[]) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));

  try {
    const { data: { result } } = await axiosGetChatroom(chatuser);
    dispatch(setToken(result.token));
    localStorage.setItem('potterSiteChatInfo', JSON.stringify(result));
    axiosSetChatConfig();

    const { data: { result: messages } } = await axiosGetMessage(result.token);
    dispatch(setCurrentMessage(messages))

    dispatch(setIsLoading(false));
  } catch (err) {
    localStorage.removeItem('potterSiteChatInfo');
    axiosSetChatConfig();
    dispatch(setIsLoading(false));
  }
}

// username: string,
// content: string,
// timestamp: Date,
// message_id: number,
// upload: uploadStatus,

export const createChatMessage = (username: string, content: string) => async (dispatch: AppDispatch) => {
  const id = new Date().getTime();
  const newMessage = { username, content, timestamp: id, message_id: id, upload: 2 };

  try {
    const messageArray = store.getState().message.currentMessage;
    dispatch(setCurrentMessage([...messageArray, newMessage]));
    const result = await axiosPostMessage(username, content);

    if (result.status === 201) {
      dispatch(setCurrentMessage([...messageArray, { ...newMessage, upload: 1 }]));
    } else {
      dispatch(setCurrentMessage([...messageArray, { ...newMessage, upload: 0 }]));
    }
  } catch (err) {
    console.log(err);
  }
}
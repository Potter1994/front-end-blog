import { Action, configureStore, getDefaultMiddleware, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux/es/types";
import userReducer from './reducers/userSlice';
import articleReducer from "./reducers/articleSlice";
import messageReducer from './reducers/messageSlice'
import notificationReducer from './reducers/notificationSlice'
import createSagaMiddleware from 'redux-saga';
import rootSaga from "./sagas/saga";

const sagaMiddleware = createSagaMiddleware();
const middleware = (getDefaultMiddleware: any) => getDefaultMiddleware().concat(sagaMiddleware);

export const store = configureStore({
  reducer: { user: userReducer, article: articleReducer, message: messageReducer, notification: notificationReducer },
  middleware
});
// const dispatch: Dispatch
// <AnyAction>(action: AnyAction) => AnyAction

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, Action<string>>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { axiosPostNotification } from './../../utils/useAPI';
import { all, call, put, takeLatest, takeEvery, delay, apply, take, fork } from 'redux-saga/effects';
import { getNotificationAction, updateNotificationAction } from './action';
import { axiosGetNotification, NotificationType } from '../../utils/useAPI';
import { setWebMessage, setHasNew, setNotification } from '../reducers/notificationSlice';
import { store } from '../store';

type ResponseType = {
  data: any;
}

function* fetchNotificationSaga() {
  try {
    const username = store.getState().user.userInfo?.username;
    const hash: any = {};
    const response: ResponseType = yield call(axiosGetNotification);
    let notificationArray = response.data.notification;

    if (username) {
      notificationArray = notificationArray.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).filter((item: any) => {
        const another = item.username === username ? item.chatuser : item.username;

        if (!hash[another]) {
          hash[another] = true;

          return true;
        }

        return false
      });

      yield put(setNotification(notificationArray));
    }
  } catch (err) {
  }
}

function* updateNotificationSaga(action: any) {
  try {
    const hash: any = {};
    const currentUser = store.getState().user.userInfo?.username;
    const notificationArray = store.getState().notification.notification;
    const { username, content, chatuser } = action.payload;
    const result: ResponseType = yield axiosPostNotification({ username, content, chatuser });
    const res = result.data.notification;

    if (res.chatuser === currentUser) {
      const content = JSON.parse(res.content);
      const notifyConfig = {
        body: content.content,
        title: username,
        icon: '/src/assets/rocket.svg',
      }

      yield put(setHasNew(true));
      yield put(setWebMessage(notifyConfig));
    }

    notificationArray.forEach((item: any) => {
      const another = item.username === currentUser ? item.chatuser : item.username;

      if (!hash[another]) {
        hash[another] = true;
      }
    });

    if (!hash[res.username] && !hash[res.chatuser]) {
      yield put(setNotification([result.data.notification, ...notificationArray]));
    } else {
      const newAnother = res.username === currentUser ? res.chatuser : res.username;
      yield put(setNotification([res, ...notificationArray.filter((i: any) => !(i.username === newAnother || i.chatuser === newAnother))]));
    }
  } catch (err) {
  }
}

export default function* rootSaga() {
  yield takeEvery(getNotificationAction, fetchNotificationSaga);
  yield takeEvery(updateNotificationAction, updateNotificationSaga);
}
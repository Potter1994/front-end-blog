import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import { axiosGetNotification, NotificationType } from '../../utils/useAPI'
import { setErrorMessage } from '../reducers/notificationSlice'

type ResponseType = {
  data: any;
}

function* fetchNotificationSaga() {
  try {
    const response: ResponseType = yield call(axiosGetNotification);
    console.log('saga =>', response);
    yield put(setErrorMessage(JSON.stringify(response.data)));
  } catch (err) {
    console.log(err);
    yield put(setErrorMessage('錯誤嘗試 saga'))
  }
}

export default function* notificationSaga() {
  yield takeEvery('notification/getNotificationAxios', fetchNotificationSaga);
}
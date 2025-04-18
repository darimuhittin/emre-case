import { all, fork } from "redux-saga/effects";
import { watchAuthSagas } from "./sagas/authSaga";
import { watchAdsSagas } from "./sagas/adsSaga";

export default function* rootSaga() {
  yield all([fork(watchAuthSagas), fork(watchAdsSagas)]);
}

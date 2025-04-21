import { all, fork } from "redux-saga/effects";
import { authSaga } from "./sagas/authSaga";
import { listingsSaga } from "./sagas/listingsSaga";
import { locationsSaga } from "./sagas/locationsSaga";
import { categoriesSaga } from "./sagas/categoriesSaga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(listingsSaga),
    fork(locationsSaga),
    fork(categoriesSaga),
  ]);
}

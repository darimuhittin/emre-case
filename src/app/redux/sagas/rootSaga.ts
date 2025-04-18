import { all, fork } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { listingsSaga } from "./listingsSaga";
import { categoriesSaga } from "./categoriesSaga";
import { locationsSaga } from "./locationsSaga";

// Root saga
export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(listingsSaga),
    fork(categoriesSaga),
    fork(locationsSaga),
  ]);
}

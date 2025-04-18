import { takeLatest, put, call } from "redux-saga/effects";
import {
  fetchAdsRequest,
  fetchAdsSuccess,
  fetchAdsFailure,
  createAdRequest,
  createAdSuccess,
  createAdFailure,
  updateAdRequest,
  updateAdSuccess,
  updateAdFailure,
  deleteAdRequest,
  deleteAdSuccess,
  deleteAdFailure,
  getAdRequest,
  getAdSuccess,
  getAdFailure,
} from "../slices/adsSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { AdFormData } from "../../types";
import api from "../../services/api";

// Fetch all ads saga
function* fetchAdsSaga() {
  try {
    const response = yield call(api.ads.getAll);
    yield put(fetchAdsSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch ads";
    yield put(fetchAdsFailure(errorMessage));
  }
}

// Create ad saga
function* createAdSaga(action: PayloadAction<AdFormData>) {
  try {
    const response = yield call(api.ads.create, action.payload);
    yield put(createAdSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create ad";
    yield put(createAdFailure(errorMessage));
  }
}

// Update ad saga
function* updateAdSaga(
  action: PayloadAction<{ id: string; data: AdFormData }>
) {
  try {
    const { id, data } = action.payload;
    const response = yield call(api.ads.update, id, data);
    yield put(updateAdSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update ad";
    yield put(updateAdFailure(errorMessage));
  }
}

// Delete ad saga
function* deleteAdSaga(action: PayloadAction<string>) {
  try {
    const id = action.payload;
    yield call(api.ads.delete, id);
    yield put(deleteAdSuccess(id));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete ad";
    yield put(deleteAdFailure(errorMessage));
  }
}

// Get single ad saga
function* getAdSaga(action: PayloadAction<string>) {
  try {
    const id = action.payload;
    const response = yield call(api.ads.getById, id);
    yield put(getAdSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch ad";
    yield put(getAdFailure(errorMessage));
  }
}

// Watch all ads sagas
export function* watchAdsSagas() {
  yield takeLatest(fetchAdsRequest.type, fetchAdsSaga);
  yield takeLatest(createAdRequest.type, createAdSaga);
  yield takeLatest(updateAdRequest.type, updateAdSaga);
  yield takeLatest(deleteAdRequest.type, deleteAdSaga);
  yield takeLatest(getAdRequest.type, getAdSaga);
}

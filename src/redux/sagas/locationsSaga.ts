import { takeLatest, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "@/services/apiClient";
import { ProvinceFormData, DistrictFormData } from "@/types";
import {
  fetchProvincesSuccess,
  fetchProvincesFailure,
  fetchProvinceSuccess,
  fetchProvinceFailure,
  createProvinceSuccess,
  createProvinceFailure,
  updateProvinceSuccess,
  updateProvinceFailure,
  deleteProvinceSuccess,
  deleteProvinceFailure,
  createDistrictSuccess,
  createDistrictFailure,
  updateDistrictSuccess,
  updateDistrictFailure,
  deleteDistrictSuccess,
  deleteDistrictFailure,
  fetchProvinces,
  createProvince,
  updateProvince,
  deleteProvince,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  fetchProvince,
} from "../slices/locationsSlice";

// Worker Sagas
function* fetchProvincesWorker() {
  try {
    const response = yield call(apiClient.getProvinces);
    console.log(response);
    yield put(fetchProvincesSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchProvincesFailure(
        axiosError.response?.data?.message || "Failed to fetch provinces"
      )
    );
  }
}

function* fetchProvinceWorker(action: PayloadAction<string>) {
  try {
    const response = yield call(apiClient.getProvinceById, action.payload);
    yield put(fetchProvinceSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchProvinceFailure(
        axiosError.response?.data?.message || "Failed to fetch province"
      )
    );
  }
}

// function* fetchDistrictWorker(action: PayloadAction<string>) {
//   try {
//     const response = yield call(apiClient.getDistrictById, action.payload);

//     // Find the province for this district
//     const provinceId = response.data.province.id;

//     // Update the district in the correct province
//     yield put(
//       updateDistrictSuccess({
//         provinceId: provinceId,
//         district: response.data,
//       })
//     );
//   } catch (error) {
//     const axiosError = error as AxiosError<{ message: string }>;
//     yield put(
//       fetchProvinceFailure(
//         axiosError.response?.data?.message || "Failed to fetch district"
//       )
//     );
//   }
// }

function* createProvinceWorker(action: PayloadAction<ProvinceFormData>) {
  try {
    const response = yield call(apiClient.createProvince, action.payload);
    yield put(createProvinceSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      createProvinceFailure(
        axiosError.response?.data?.message || "Failed to create province"
      )
    );
  }
}

function* createDistrictWorker(action: PayloadAction<DistrictFormData>) {
  try {
    const response = yield call(apiClient.createDistrict, action.payload);

    // Add the district to the correct province
    yield put(
      createDistrictSuccess({
        provinceId: action.payload.provinceId,
        district: response.data,
      })
    );
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      createDistrictFailure(
        axiosError.response?.data?.message || "Failed to create district"
      )
    );
  }
}

function* updateProvinceWorker(
  action: PayloadAction<{ id: string; data: ProvinceFormData }>
) {
  try {
    const response = yield call(
      apiClient.updateProvince,
      action.payload.id,
      action.payload.data
    );
    yield put(updateProvinceSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      updateProvinceFailure(
        axiosError.response?.data?.message || "Failed to update province"
      )
    );
  }
}

function* updateDistrictWorker(
  action: PayloadAction<{ id: string; data: DistrictFormData }>
) {
  try {
    const response = yield call(
      apiClient.updateDistrict,
      action.payload.id,
      action.payload.data
    );

    // If the province changed, handle that in our reducer
    const provinceId =
      action.payload.data.provinceId || response.data.province.id;

    // Update the district in the correct province
    yield put(
      updateDistrictSuccess({
        provinceId: provinceId,
        district: response.data,
      })
    );
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      updateDistrictFailure(
        axiosError.response?.data?.message || "Failed to update district"
      )
    );
  }
}

function* deleteProvinceWorker(action: PayloadAction<string>) {
  try {
    yield call(apiClient.deleteProvince, action.payload);
    yield put(deleteProvinceSuccess(action.payload));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      deleteProvinceFailure(
        axiosError.response?.data?.message || "Failed to delete province"
      )
    );
  }
}

function* deleteDistrictWorker(action: PayloadAction<string>) {
  try {
    // First get the district to find its province
    const districtResponse = yield call(
      apiClient.getDistrictById,
      action.payload
    );
    const provinceId = districtResponse.data.province.id;

    // Then delete it
    yield call(apiClient.deleteDistrict, action.payload);

    // Update our store
    yield put(
      deleteDistrictSuccess({
        provinceId: provinceId,
        districtId: action.payload,
      })
    );
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      deleteDistrictFailure(
        axiosError.response?.data?.message || "Failed to delete district"
      )
    );
  }
}

// Watcher Saga
export function* locationsSaga() {
  yield all([
    takeLatest(fetchProvinces.type, fetchProvincesWorker),
    takeLatest(fetchProvince.type, fetchProvinceWorker),
    takeLatest(createProvince.type, createProvinceWorker),
    takeLatest(createDistrict.type, createDistrictWorker),
    takeLatest(updateProvince.type, updateProvinceWorker),
    takeLatest(updateDistrict.type, updateDistrictWorker),
    takeLatest(deleteProvince.type, deleteProvinceWorker),
    takeLatest(deleteDistrict.type, deleteDistrictWorker),
  ]);
}

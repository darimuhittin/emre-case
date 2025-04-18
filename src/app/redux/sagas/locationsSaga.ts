import { takeLatest, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "../../services/apiClient";
import { ProvinceFormData, DistrictFormData } from "../../types";
import {
  setLoading,
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
} from "../slices/locationsSlice";

// Create action types for saga
export const FETCH_PROVINCES_REQUEST = "locations/fetchProvincesRequest";
export const FETCH_PROVINCE_REQUEST = "locations/fetchProvinceRequest";
export const FETCH_DISTRICT_REQUEST = "locations/fetchDistrictRequest";
export const CREATE_PROVINCE_REQUEST = "locations/createProvinceRequest";
export const CREATE_DISTRICT_REQUEST = "locations/createDistrictRequest";
export const UPDATE_PROVINCE_REQUEST = "locations/updateProvinceRequest";
export const UPDATE_DISTRICT_REQUEST = "locations/updateDistrictRequest";
export const DELETE_PROVINCE_REQUEST = "locations/deleteProvinceRequest";
export const DELETE_DISTRICT_REQUEST = "locations/deleteDistrictRequest";

// Create action creators for saga
export const fetchProvincesRequest = () => ({
  type: FETCH_PROVINCES_REQUEST,
});

export const fetchProvinceRequest = (id: string) => ({
  type: FETCH_PROVINCE_REQUEST,
  payload: id,
});

export const fetchDistrictRequest = (id: string) => ({
  type: FETCH_DISTRICT_REQUEST,
  payload: id,
});

export const createProvinceRequest = (data: ProvinceFormData) => ({
  type: CREATE_PROVINCE_REQUEST,
  payload: data,
});

export const createDistrictRequest = (data: DistrictFormData) => ({
  type: CREATE_DISTRICT_REQUEST,
  payload: data,
});

export const updateProvinceRequest = (id: string, data: ProvinceFormData) => ({
  type: UPDATE_PROVINCE_REQUEST,
  payload: { id, data },
});

export const updateDistrictRequest = (id: string, data: DistrictFormData) => ({
  type: UPDATE_DISTRICT_REQUEST,
  payload: { id, data },
});

export const deleteProvinceRequest = (id: string) => ({
  type: DELETE_PROVINCE_REQUEST,
  payload: id,
});

export const deleteDistrictRequest = (id: string) => ({
  type: DELETE_DISTRICT_REQUEST,
  payload: id,
});

// Worker Sagas
function* fetchProvincesWorker() {
  try {
    yield put(setLoading(true));
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
    yield put(setLoading(true));
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

function* fetchDistrictWorker(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    const response = yield call(apiClient.getDistrictById, action.payload);

    // Find the province for this district
    const provinceId = response.data.province.id;

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
      fetchProvinceFailure(
        axiosError.response?.data?.message || "Failed to fetch district"
      )
    );
  }
}

function* createProvinceWorker(action: PayloadAction<ProvinceFormData>) {
  try {
    yield put(setLoading(true));
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
    yield put(setLoading(true));
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
    yield put(setLoading(true));
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
    yield put(setLoading(true));
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
    yield put(setLoading(true));
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
    yield put(setLoading(true));

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
    takeLatest(FETCH_PROVINCES_REQUEST, fetchProvincesWorker),
    takeLatest(FETCH_PROVINCE_REQUEST, fetchProvinceWorker),
    takeLatest(FETCH_DISTRICT_REQUEST, fetchDistrictWorker),
    takeLatest(CREATE_PROVINCE_REQUEST, createProvinceWorker),
    takeLatest(CREATE_DISTRICT_REQUEST, createDistrictWorker),
    takeLatest(UPDATE_PROVINCE_REQUEST, updateProvinceWorker),
    takeLatest(UPDATE_DISTRICT_REQUEST, updateDistrictWorker),
    takeLatest(DELETE_PROVINCE_REQUEST, deleteProvinceWorker),
    takeLatest(DELETE_DISTRICT_REQUEST, deleteDistrictWorker),
  ]);
}

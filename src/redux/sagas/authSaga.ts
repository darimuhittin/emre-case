import { takeLatest, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "@/services/apiClient";
import { LoginCredentials } from "@/types/login";
import { RegisterCredentials } from "@/types/register";
import {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  logoutFailure,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
  verifyEmailSuccess,
  verifyEmailFailure,
  loginRequest,
  registerRequest,
  logoutRequest,
  fetchUserProfileRequest,
  verifyEmailRequest,
  initAuth,
  initAuthFailure,
  initAuthSuccess,
} from "../slices/authSlice";
import { navigate } from "@/services/navigationHelper";
// Create action types for saga

// Worker Sagas
function* loginWorker(action: PayloadAction<LoginCredentials>) {
  try {
    const response = yield call(apiClient.login, action.payload);
    console.log("HERE RESPONSE LOGIN: ", response);
    yield put(loginSuccess(response));
    navigate("/");
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.log("HERE ERROR LOGIN: ", axiosError);
    yield put(
      loginFailure(axiosError.response?.data?.message || "Login failed")
    );
  }
}

function* registerWorker(action: PayloadAction<RegisterCredentials>) {
  try {
    yield call(apiClient.register, action.payload);
    yield put(registerSuccess());
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      registerFailure(
        axiosError.response?.data?.message || "Registration failed"
      )
    );
  }
}

function* logoutWorker() {
  try {
    console.log("HERE LOGOUT WORKER");
    yield call(apiClient.logout);
    yield put(logoutSuccess());
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      logoutFailure(axiosError.response?.data?.message || "Logout failed")
    );
  }
}

function* fetchUserProfileWorker() {
  try {
    const response = yield call(apiClient.getUserProfile);
    yield put(fetchUserProfileSuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchUserProfileFailure(
        axiosError.response?.data?.message || "Failed to fetch user profile"
      )
    );
  }
}

function* verifyEmailWorker(action: PayloadAction<string>) {
  try {
    yield call(apiClient.verifyEmail, action.payload);
    yield put(verifyEmailSuccess());
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      verifyEmailFailure(
        axiosError.response?.data?.message || "Email verification failed"
      )
    );
  }
}

function* initAuthWorker() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) {
      yield put(initAuthFailure("No tokens found"));
      return;
    }
    const response = yield call(apiClient.getUserProfile);
    yield put(initAuthSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      initAuthFailure(
        axiosError.response?.data?.message ||
          "Failed to initialize authentication"
      )
    );
  }
}

// Watcher Saga
export function* authSaga() {
  yield all([
    takeLatest(loginRequest.type, loginWorker),
    takeLatest(registerRequest.type, registerWorker),
    takeLatest(logoutRequest.type, logoutWorker),
    takeLatest(fetchUserProfileRequest.type, fetchUserProfileWorker),
    takeLatest(verifyEmailRequest.type, verifyEmailWorker),
    takeLatest(initAuth.type, initAuthWorker),
  ]);
}

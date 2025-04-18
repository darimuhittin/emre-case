import { takeLatest, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "../../services/apiClient";
import { LoginCredentials, RegisterCredentials } from "../../types";
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
  setLoading,
} from "../slices/authSlice";

// Create action types for saga
export const LOGIN_REQUEST = "auth/loginRequest";
export const REGISTER_REQUEST = "auth/registerRequest";
export const LOGOUT_REQUEST = "auth/logoutRequest";
export const FETCH_USER_PROFILE_REQUEST = "auth/fetchUserProfileRequest";
export const VERIFY_EMAIL_REQUEST = "auth/verifyEmailRequest";

// Create action creators for saga
export const loginRequest = (credentials: LoginCredentials) => ({
  type: LOGIN_REQUEST,
  payload: credentials,
});

export const registerRequest = (userData: RegisterCredentials) => ({
  type: REGISTER_REQUEST,
  payload: userData,
});

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

export const fetchUserProfileRequest = () => ({
  type: FETCH_USER_PROFILE_REQUEST,
});

export const verifyEmailRequest = (token: string) => ({
  type: VERIFY_EMAIL_REQUEST,
  payload: token,
});

// Worker Sagas
function* loginWorker(action: PayloadAction<LoginCredentials>) {
  try {
    yield put(setLoading(true));
    const response = yield call(apiClient.login, action.payload);
    yield put(loginSuccess(response.data));

    // Fetch user profile after successful login
    yield put(fetchUserProfileRequest());
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      loginFailure(axiosError.response?.data?.message || "Login failed")
    );
  }
}

function* registerWorker(action: PayloadAction<RegisterCredentials>) {
  try {
    yield put(setLoading(true));
    yield call(apiClient.register, action.payload);
    yield put(registerSuccess());

    // After registration, automatically log the user in
    yield put(
      loginRequest({
        email: action.payload.email,
        password: action.payload.password,
      })
    );
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
    yield put(setLoading(true));
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
    yield put(setLoading(true));
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
    yield put(setLoading(true));
    yield call(apiClient.verifyEmail, action.payload);
    yield put(verifyEmailSuccess());

    // Refresh user profile after email verification
    yield put(fetchUserProfileRequest());
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      verifyEmailFailure(
        axiosError.response?.data?.message || "Email verification failed"
      )
    );
  }
}

// Watcher Saga
export function* authSaga() {
  yield all([
    takeLatest(LOGIN_REQUEST, loginWorker),
    takeLatest(REGISTER_REQUEST, registerWorker),
    takeLatest(LOGOUT_REQUEST, logoutWorker),
    takeLatest(FETCH_USER_PROFILE_REQUEST, fetchUserProfileWorker),
    takeLatest(VERIFY_EMAIL_REQUEST, verifyEmailWorker),
  ]);
}

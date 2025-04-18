import { takeLatest, put, call } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "../slices/authSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { LoginCredentials, RegisterCredentials } from "../../types";
import api from "../../services/api";

// Define common return types for sagas
type SagaEffect = ReturnType<typeof call> | ReturnType<typeof put>;

// Login saga
function* loginSaga(
  action: PayloadAction<LoginCredentials>
): Generator<SagaEffect, void, any> {
  try {
    const response = yield call(api.auth.login, action.payload);

    // Save tokens to localStorage for persistence
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    yield put(loginSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    yield put(loginFailure(errorMessage));
  }
}

// Register saga
function* registerSaga(
  action: PayloadAction<RegisterCredentials>
): Generator<SagaEffect, void, any> {
  try {
    yield call(api.auth.register, action.payload);
    yield put(registerSuccess());

    // Auto-login after successful registration
    yield put(
      loginRequest({
        email: action.payload.email,
        password: action.payload.password,
      })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    yield put(registerFailure(errorMessage));
  }
}

// Refresh token saga
function* refreshTokenSaga(): Generator<SagaEffect, void, any> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    const response = yield call(api.auth.refreshToken, refreshToken);

    // Update tokens in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    yield put(refreshTokenSuccess(response.data));
  } catch (error: unknown) {
    // Clear tokens on failure
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    yield put(refreshTokenFailure());
  }
}

// Watch all auth sagas
export function* watchAuthSagas() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../types";

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Initialize authentication state from localStorage
    initAuth: (state) => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = !!accessToken;
      }
      state.isLoading = false;
    },
    // Login success
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    // Login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    // Register success
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    // Register failure
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Logout success
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Logout failure
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Fetch user profile success
    fetchUserProfileSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    // Fetch user profile failure
    fetchUserProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Verify email success
    verifyEmailSuccess: (state) => {
      state.isLoading = false;
      if (state.user) {
        state.user.isEmailVerified = true;
      }
      state.error = null;
    },
    // Verify email failure
    verifyEmailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  clearError,
  setLoading,
  initAuth,
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
} = authSlice.actions;

export default authSlice.reducer;

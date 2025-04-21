import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthState } from "@/types/redux/auth";
import { User } from "@/types/entities/user";
import { LoginCredentials } from "@/types/login";
import { RegisterCredentials } from "@/types/register";
import { toast } from "sonner";
// Initial state
const initialState: IAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  loginError: null,
  registerError: null,
  isAuthenticated: false,
  error: null,
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
      state.loginError = null;
      state.registerError = null;
    },
    // Initialize authentication state from localStorage
    initAuth: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    initAuthFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    initAuthSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      state.isAuthenticated = true;
    },

    // login request
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.isLoading = true;
      state.loginError = null;
    },
    // Login success
    loginSuccess: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.loginError = null;
      state.user = action.payload.user;
      toast.success("Login successful");
    },
    // Login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.loginError = action.payload;
      state.isAuthenticated = false;
      toast.error("Login failed");
    },
    // Register request
    registerRequest: (state, _action: PayloadAction<RegisterCredentials>) => {
      state.isLoading = true;
      state.registerError = null;
    },
    // Register success
    registerSuccess: (state) => {
      state.isLoading = false;
      state.registerError = null;
      toast.success("Register successful");
    },
    // Register failure
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.registerError = action.payload;
      toast.error("Register failed");
    },
    // Logout request
    logoutRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // Logout success
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      toast.success("Logout successful");
    },
    // Logout failure
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error("Logout failed");
    },
    // Fetch user profile request
    fetchUserProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
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
    // Verify email request
    verifyEmailRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    // Verify email success
    verifyEmailSuccess: (state) => {
      state.isLoading = false;
      if (state.user) {
        state.user.isEmailVerified = true;
      }
      state.error = null;
      toast.success("Email verified successfully");
    },
    // Verify email failure
    verifyEmailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error("Email verification failed");
    },
  },
});

export const {
  clearError,
  setLoading,
  initAuth,
  initAuthFailure,
  initAuthSuccess,
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
} = authSlice.actions;

export default authSlice.reducer;

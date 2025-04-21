import { User } from "../entities/user";

export interface IAuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  loginError: string | null;
  registerError: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

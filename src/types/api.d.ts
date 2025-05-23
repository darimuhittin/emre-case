import {
  LoginCredentials,
  RegisterCredentials,
  AdFormData,
  User,
  Ad,
} from "../types";

// Define the API service interface
declare namespace ApiService {
  interface AuthApi {
    login: (credentials: LoginCredentials) => Promise<{ data: User }>;
    register: (
      userData: RegisterCredentials
    ) => Promise<{ data: { success: boolean } }>;
    refreshToken: (refreshToken: string) => Promise<{ data: User }>;
  }

  interface AdsApi {
    getAll: () => Promise<{ data: Ad[] }>;
    getById: (id: string) => Promise<{ data: Ad }>;
    create: (adData: AdFormData) => Promise<{ data: Ad }>;
    update: (id: string, adData: AdFormData) => Promise<{ data: Ad }>;
    delete: (id: string) => Promise<{ data: { success: boolean } }>;
  }

  interface Api {
    auth: AuthApi;
    ads: AdsApi;
  }
}

declare const api: ApiService.Api;
export default api;

export interface ApiResponseMultiple<T> {
  items: T[];
  meta: Meta;
}

export interface ApiResponse<T> {
  data: T;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
export interface RegisterResponse {
  message: string;
  verificationToken: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  password: string;
  refreshToken: string;
  verificationToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListingResponse {
  items: Listing[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  districtId: string;
}
export interface CreateCategoryRequest {
  name: string;
}

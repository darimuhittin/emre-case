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

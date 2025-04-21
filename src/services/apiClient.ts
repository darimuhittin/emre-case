import axios, { AxiosInstance } from "axios";
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenRefreshRequest,
  UserProfile,
  Listing,
  Category,
  Province,
  District,
  CreateProvinceRequest,
  CreateDistrictRequest,
  CreateCategoryRequest,
  ApiResponseMultiple,
  RegisterResponse,
} from "./api";
import { navigate } from "./navigationHelper";
import { toast } from "sonner";
import { store } from "@/redux/store";
import { logoutSuccess } from "@/redux/slices/authSlice";
const API_URL = "http://localhost:8000";

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<AuthResponse> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors = () => {
    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 error and not already retrying
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== "/auth/login" &&
          originalRequest.url !== "/auth/refresh-token" // Prevent endless loop if refresh itself fails
        ) {
          originalRequest._retry = true;

          try {
            // Use a singleton promise for refreshing to prevent multiple refresh requests
            if (!this.refreshPromise) {
              const refreshToken = localStorage.getItem("refreshToken");
              if (!refreshToken) {
                throw new Error("No refresh token available");
              }

              this.refreshPromise = this.client
                .post<AuthResponse>("/auth/refresh-token", { refreshToken })
                .then((response) => response.data);
            }

            const tokenData = await this.refreshPromise;
            this.refreshPromise = null;

            // Update tokens in storage
            localStorage.setItem("accessToken", tokenData.accessToken);
            localStorage.setItem("refreshToken", tokenData.refreshToken);

            // Retry the original request with new token
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${tokenData.accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.refreshPromise = null; // Reset promise on error
            // Clear tokens and redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            toast.error("Session expired, please login again");
            navigate("/login");
            store.dispatch(logoutSuccess());
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  };

  // Auth Endpoints
  register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await this.client.post<RegisterResponse>(
      "/auth/register",
      data
    );
    if (response.data.verificationToken) {
      window.location.href = `/register/verify/${response.data.verificationToken}`;
    }
    return response.data;
  };

  login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await this.client.post<AuthResponse>("/auth/login", data);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data;
  };

  verifyEmail = async (
    token: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await this.client.get<ApiResponse<{ message: string }>>(
      `/auth/verify/${token}`
    );
    return response.data;
  };

  refreshToken = async (
    data: TokenRefreshRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      "/auth/refresh-token",
      data
    );
    return response.data;
  };

  logout = async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await this.client.post<ApiResponse<{ message: string }>>(
      "/auth/logout"
    );
    // Clear tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return response.data;
  };

  // User Endpoints
  getUserProfile = async (): Promise<UserProfile> => {
    const response = await this.client.get<UserProfile>("/users/profile");
    return response.data;
  };

  // Listings Endpoints
  getListings = async (params?: {
    categoryId?: string;
    provinceId?: string;
    districtId?: string;
    search?: string;
    page?: number;
    limit?: number;
    userId?: string;
  }): Promise<ApiResponseMultiple<Listing>> => {
    const response = await this.client.get<ApiResponseMultiple<Listing>>(
      "/listings",
      { params }
    );
    return response.data;
  };

  getListingBySlug = async (slug: string): Promise<ApiResponse<Listing>> => {
    const response = await this.client.get<ApiResponse<Listing>>(
      `/listings/slug/${slug}`
    );
    return response.data;
  };

  createListing = async (data: FormData): Promise<Listing> => {
    const response = await this.client.post<Listing>(`/listings`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  updateListing = async (id: string, data: FormData): Promise<Listing> => {
    const response = await this.client.patch<Listing>(`/listings/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };
  deleteListing = async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await this.client.delete<ApiResponse<{ message: string }>>(
      `/listings/${id}`
    );
    return response.data;
  };

  uploadListingImage = async (
    listingId: string,
    image: File
  ): Promise<ApiResponse<Listing>> => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await this.client.post<ApiResponse<Listing>>(
      `/listings/${listingId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  deleteListingImage = async (
    listingId: string,
    index: number
  ): Promise<ApiResponse<Listing>> => {
    const response = await this.client.delete<ApiResponse<Listing>>(
      `/listings/${listingId}/images/${index}`
    );
    return response.data;
  };

  // Categories Endpoints
  getCategories = async (): Promise<ApiResponseMultiple<Category>> => {
    const response = await this.client.get<ApiResponseMultiple<Category>>(
      "/categories"
    );
    return response.data;
  };

  getCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
    const response = await this.client.get<ApiResponse<Category>>(
      `/categories/${id}`
    );
    return response.data;
  };

  createCategory = async (
    data: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await this.client.post<ApiResponse<Category>>(
      "/categories",
      data
    );
    return response.data;
  };

  updateCategory = async (
    id: string,
    data: CreateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await this.client.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return response.data;
  };

  deleteCategory = async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await this.client.delete<ApiResponse<{ message: string }>>(
      `/categories/${id}`
    );
    return response.data;
  };

  // Locations Endpoints
  getProvinces = async (): Promise<ApiResponseMultiple<Province>> => {
    const response = await this.client.get<ApiResponseMultiple<Province>>(
      "/locations/provinces"
    );
    return response.data;
  };

  getProvinceById = async (id: string): Promise<ApiResponse<Province>> => {
    const response = await this.client.get<ApiResponse<Province>>(
      `/locations/provinces/${id}`
    );
    return response.data;
  };

  getDistrictById = async (id: string): Promise<ApiResponse<District>> => {
    const response = await this.client.get<ApiResponse<District>>(
      `/locations/districts/${id}`
    );
    return response.data;
  };

  createProvince = async (
    data: CreateProvinceRequest
  ): Promise<ApiResponse<Province>> => {
    const response = await this.client.post<ApiResponse<Province>>(
      "/locations/provinces",
      data
    );
    return response.data;
  };

  createDistrict = async (
    data: CreateDistrictRequest
  ): Promise<ApiResponse<District>> => {
    const response = await this.client.post<ApiResponse<District>>(
      "/locations/districts",
      data
    );
    return response.data;
  };

  updateProvince = async (
    id: string,
    data: CreateProvinceRequest
  ): Promise<ApiResponse<Province>> => {
    const response = await this.client.patch<ApiResponse<Province>>(
      `/locations/provinces/${id}`,
      data
    );
    return response.data;
  };

  updateDistrict = async (
    id: string,
    data: CreateDistrictRequest
  ): Promise<ApiResponse<District>> => {
    const response = await this.client.patch<ApiResponse<District>>(
      `/locations/districts/${id}`,
      data
    );
    return response.data;
  };

  deleteProvince = async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await this.client.delete<ApiResponse<{ message: string }>>(
      `/locations/provinces/${id}`
    );
    return response.data;
  };

  deleteDistrict = async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await this.client.delete<ApiResponse<{ message: string }>>(
      `/locations/districts/${id}`
    );
    return response.data;
  };

  getMyListings = async (): Promise<ApiResponseMultiple<Listing>> => {
    const response = await this.client.get<ApiResponseMultiple<Listing>>(
      `/listings/my`
    );
    return response.data;
  };
}

const apiClient = new ApiClient();
export default apiClient;

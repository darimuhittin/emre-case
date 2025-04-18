export interface User {
  id: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  category: string;
  province: string;
  district: string;
  price: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AdsState {
  ads: Ad[];
  filteredAds: Ad[];
  selectedAd: Ad | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    province: string;
    district: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AdFormData {
  title: string;
  description: string;
  category: string;
  province: string;
  district: string;
  price: number;
  images: File[];
}

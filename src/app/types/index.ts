export interface User {
  id: string;
  email: string;
  name?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user: User;
  category: Category;
  district: District;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  listingsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Province {
  id: string;
  name: string;
  districts: District[];
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  name: string;
  province: Province;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ListingsState {
  listings: Listing[];
  totalListings: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  selectedListing: Listing | null;
  selectedListingLoading: boolean;
  isLoading: boolean;
  error: string | null;
  filters: {
    categoryId?: string;
    provinceId?: string;
    districtId?: string;
    search?: string;
  };

  createListingLoading: boolean;
  createListingError: string | null;
  updateListingLoading: boolean;
  updateListingError: string | null;
  deleteListingLoading: boolean;
  deleteListingError: string | null;
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface LocationsState {
  provinces: Province[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  districtId: string;
  images: File[];
}

export interface CategoryFormData {
  name: string;
}

export interface ProvinceFormData {
  name: string;
}

export interface DistrictFormData {
  name: string;
  provinceId: string;
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListingsState, Listing, ListingFormData } from "../../types";
import { ApiResponseMultiple } from "../../services/api.d";
import { toast } from "sonner";

// Initial state
const initialState: ListingsState = {
  listings: [],
  totalListings: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  selectedListing: null,
  selectedListingLoading: true,
  isLoading: false,
  error: null,
  filters: {},
  createListingLoading: false,
  createListingError: null,
  updateListingLoading: false,
  updateListingError: null,
  deleteListingLoading: false,
  deleteListingError: null,
};

// Listings slice
const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    // Fetch listings actions
    fetchListingsRequest: (
      state,
      action: PayloadAction<{
        page?: number;
        categoryId?: string;
        provinceId?: string;
        districtId?: string;
        search?: string;
      }>
    ) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        state.filters = { ...action.payload };
        if (action.payload.page) {
          state.currentPage = action.payload.page;
        }
      }
    },
    fetchListingsSuccess: (
      state,
      action: PayloadAction<ApiResponseMultiple<Listing>>
    ) => {
      state.isLoading = false;
      state.listings = action.payload.items;
      state.totalListings = action.payload.meta.total;
      state.currentPage = action.payload.meta.page;
      state.pageSize = action.payload.meta.limit;
      state.totalPages = action.payload.meta.totalPages;
    },
    fetchListingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch single listing
    fetchListingRequestStart: (state) => {
      state.selectedListingLoading = true;
      state.error = null;
    },
    fetchListingSuccess: (state, action: PayloadAction<Listing>) => {
      state.selectedListingLoading = false;
      state.selectedListing = action.payload;
    },
    fetchListingFailure: (state, action: PayloadAction<string>) => {
      state.selectedListingLoading = false;
      state.error = action.payload;
    },

    // Create listing
    createListingRequest: (state, _: PayloadAction<ListingFormData>) => {
      state.createListingLoading = true;
      state.createListingError = null;
    },
    createListingSuccess: (state, action: PayloadAction<Listing>) => {
      state.createListingLoading = false;
      state.listings = [action.payload, ...state.listings];
      state.totalListings += 1;
      toast.success("Listing created successfully");
    },
    createListingFailure: (state, action: PayloadAction<string>) => {
      state.createListingLoading = false;
      state.createListingError = action.payload;
      toast.error("Failed to create listing");
    },

    // Update listing
    updateListingRequest: (
      state,
      _: PayloadAction<{
        id: string;
        data: ListingFormData;
      }>
    ) => {
      state.updateListingLoading = true;
      state.updateListingError = null;
    },
    updateListingSuccess: (state, action: PayloadAction<Listing>) => {
      state.updateListingLoading = false;
      state.listings = state.listings.map((listing) =>
        listing.id === action.payload.id ? action.payload : listing
      );
      if (state.selectedListing?.id === action.payload.id) {
        state.selectedListing = action.payload;
      }
      toast.success("Listing updated successfully");
    },
    updateListingFailure: (state, action: PayloadAction<string>) => {
      state.updateListingLoading = false;
      state.updateListingError = action.payload;
      toast.error("Failed to update listing");
    },

    // Delete listing
    deleteListingRequestStart: (state) => {
      state.deleteListingLoading = true;
      state.deleteListingError = null;
    },
    deleteListingSuccess: (state, action: PayloadAction<string>) => {
      state.deleteListingLoading = false;
      state.listings = state.listings.filter(
        (listing) => listing.id !== action.payload
      );
      state.totalListings -= 1;
      if (state.selectedListing?.id === action.payload) {
        state.selectedListing = null;
      }
      toast.success("Listing deleted successfully");
    },
    deleteListingFailure: (state, action: PayloadAction<string>) => {
      state.deleteListingLoading = false;
      state.deleteListingError = action.payload;
      toast.error("Failed to delete listing");
    },

    // Upload listing image
    uploadListingImageRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    uploadListingImageSuccess: (state, action: PayloadAction<Listing>) => {
      state.isLoading = false;
      state.listings = state.listings.map((listing) =>
        listing.id === action.payload.id ? action.payload : listing
      );
      if (state.selectedListing?.id === action.payload.id) {
        state.selectedListing = action.payload;
      }
      toast.success("Listing image uploaded successfully");
    },
    uploadListingImageFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error("Failed to upload listing image");
    },

    // Delete listing image
    deleteListingImageRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteListingImageSuccess: (state, action: PayloadAction<Listing>) => {
      state.isLoading = false;
      state.listings = state.listings.map((listing) =>
        listing.id === action.payload.id ? action.payload : listing
      );
      if (state.selectedListing?.id === action.payload.id) {
        state.selectedListing = action.payload;
      }
      toast.success("Listing image deleted successfully");
    },
    deleteListingImageFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error("Failed to delete listing image");
    },

    // Reset selected listing
    resetSelectedListing: (state) => {
      state.selectedListing = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    setFilters: (
      state,
      action: PayloadAction<{
        categoryId?: string;
        provinceId?: string;
        districtId?: string;
        search?: string;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  fetchListingsRequest,
  fetchListingsSuccess,
  fetchListingsFailure,
  fetchListingRequestStart,
  fetchListingSuccess,
  fetchListingFailure,
  createListingRequest,
  createListingSuccess,
  createListingFailure,
  updateListingRequest,
  updateListingSuccess,
  updateListingFailure,
  deleteListingRequestStart,
  deleteListingSuccess,
  deleteListingFailure,
  uploadListingImageRequest,
  uploadListingImageSuccess,
  uploadListingImageFailure,
  deleteListingImageRequest,
  deleteListingImageSuccess,
  deleteListingImageFailure,
  resetSelectedListing,
  clearError,
  setFilters,
  clearFilters,
} = listingsSlice.actions;

export default listingsSlice.reducer;

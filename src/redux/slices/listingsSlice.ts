import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Listing, IListingFilters } from "@/types/entities/listing";
import { IListingState } from "@/types/redux/listing";
import { ApiResponseMultiple } from "@/services/api";
import { toast } from "sonner";

// Initial state
const initialState: IListingState = {
  listings: [],
  totalListings: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  selectedListing: null,
  selectedListingLoading: true,
  isLoading: true,
  error: null,
  filters: {},
  createListingLoading: false,
  createListingError: null,
  updateListingLoading: false,
  updateListingError: null,
  deleteListingLoading: false,
  deleteListingError: null,

  fetchMyListingsLoading: false,
  fetchMyListingsError: null,
  myListings: [],
};

// Listings slice
const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    // Fetch listings actions
    fetchListingsRequest: (state, action: PayloadAction<IListingFilters>) => {
      state.isLoading = true;
      state.error = null;

      if (action.payload) {
        state.filters = {
          ...action.payload,
        };
        if (action.payload.page) {
          state.currentPage = action.payload.page;
        }
      }
    },

    fetchMyListingsRequest: (state) => {
      state.fetchMyListingsLoading = true;
      state.fetchMyListingsError = null;
    },
    fetchMyListingsSuccess: (state, action: PayloadAction<Listing[]>) => {
      state.fetchMyListingsLoading = false;
      state.myListings = action.payload;
    },
    fetchMyListingsFailure: (state, action: PayloadAction<string>) => {
      state.fetchMyListingsLoading = false;
      state.fetchMyListingsError = action.payload;
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
    fetchListingRequest: (state, _action: PayloadAction<string>) => {
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
    createListingRequest: (state, _: PayloadAction<FormData>) => {
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
        data: FormData;
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
    deleteListingRequest: (state, _: PayloadAction<string>) => {
      state.deleteListingLoading = true;
      state.deleteListingError = null;
    },
    deleteListingSuccess: (state, action: PayloadAction<string>) => {
      state.deleteListingLoading = false;
      state.listings = state.listings.filter(
        (listing) => listing.id !== action.payload
      );
      state.myListings = state.myListings.filter(
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
        category?: string;
        province?: string;
        district?: string;
        search?: string;
        page?: number;
        limit?: number;
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
  fetchListingRequest,
  fetchListingSuccess,
  fetchListingFailure,
  createListingRequest,
  createListingSuccess,
  createListingFailure,
  updateListingRequest,
  updateListingSuccess,
  updateListingFailure,
  deleteListingRequest,
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
  fetchMyListingsRequest,
  fetchMyListingsSuccess,
  fetchMyListingsFailure,
} = listingsSlice.actions;

export default listingsSlice.reducer;

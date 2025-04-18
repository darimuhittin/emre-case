import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdsState, Ad, AdFormData } from "../../types";

const initialState: AdsState = {
  ads: [],
  filteredAds: [],
  selectedAd: null,
  isLoading: false,
  error: null,
  filters: {
    category: "",
    province: "",
    district: "",
  },
};

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    // Fetch all ads
    fetchAdsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAdsSuccess: (state, action: PayloadAction<Ad[]>) => {
      state.isLoading = false;
      state.ads = action.payload;
      state.filteredAds = action.payload;
      state.error = null;
    },
    fetchAdsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create ad
    createAdRequest: (state, _action: PayloadAction<AdFormData>) => {
      state.isLoading = true;
      state.error = null;
    },
    createAdSuccess: (state, action: PayloadAction<Ad>) => {
      state.isLoading = false;
      state.ads = [...state.ads, action.payload];
      state.filteredAds = [...state.filteredAds, action.payload];
      state.error = null;
    },
    createAdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update ad
    updateAdRequest: (
      state,
      _action: PayloadAction<{ id: string; data: AdFormData }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateAdSuccess: (state, action: PayloadAction<Ad>) => {
      state.isLoading = false;
      state.ads = state.ads.map((ad) =>
        ad.id === action.payload.id ? action.payload : ad
      );
      state.filteredAds = state.filteredAds.map((ad) =>
        ad.id === action.payload.id ? action.payload : ad
      );
      state.selectedAd = action.payload;
      state.error = null;
    },
    updateAdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete ad
    deleteAdRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteAdSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.ads = state.ads.filter((ad) => ad.id !== action.payload);
      state.filteredAds = state.filteredAds.filter(
        (ad) => ad.id !== action.payload
      );
      state.error = null;
    },
    deleteAdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get single ad
    getAdRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    getAdSuccess: (state, action: PayloadAction<Ad>) => {
      state.isLoading = false;
      state.selectedAd = action.payload;
      state.error = null;
    },
    getAdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Filter ads
    setFilters: (
      state,
      action: PayloadAction<{
        category?: string;
        province?: string;
        district?: string;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredAds = state.ads.filter((ad) => {
        return (
          (!state.filters.category || ad.category === state.filters.category) &&
          (!state.filters.province || ad.province === state.filters.province) &&
          (!state.filters.district || ad.district === state.filters.district)
        );
      });
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        category: "",
        province: "",
        district: "",
      };
      state.filteredAds = state.ads;
    },
  },
});

export const {
  fetchAdsRequest,
  fetchAdsSuccess,
  fetchAdsFailure,
  createAdRequest,
  createAdSuccess,
  createAdFailure,
  updateAdRequest,
  updateAdSuccess,
  updateAdFailure,
  deleteAdRequest,
  deleteAdSuccess,
  deleteAdFailure,
  getAdRequest,
  getAdSuccess,
  getAdFailure,
  setFilters,
  clearFilters,
} = adsSlice.actions;

export default adsSlice.reducer;

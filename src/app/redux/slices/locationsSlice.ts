import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationsState, Province, District } from "../../types";
import { ApiResponseMultiple } from "../../services/api.d";
// Initial state
const initialState: LocationsState = {
  provinces: [],
  isLoading: false,
  error: null,
};

// Locations slice
const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Fetch provinces success
    fetchProvincesSuccess: (
      state,
      action: PayloadAction<ApiResponseMultiple<Province>>
    ) => {
      state.provinces = action.payload.items;
      state.isLoading = false;
      state.error = null;
    },

    // Fetch provinces failure
    fetchProvincesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch province success
    fetchProvinceSuccess: (state, action: PayloadAction<Province>) => {
      const index = state.provinces.findIndex(
        (province) => province.id === action.payload.id
      );
      if (index >= 0) {
        state.provinces[index] = action.payload;
      } else {
        state.provinces.push(action.payload);
      }
      state.isLoading = false;
      state.error = null;
    },

    // Fetch province failure
    fetchProvinceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create province success
    createProvinceSuccess: (state, action: PayloadAction<Province>) => {
      state.provinces.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },

    // Create province failure
    createProvinceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update province success
    updateProvinceSuccess: (state, action: PayloadAction<Province>) => {
      const index = state.provinces.findIndex(
        (province) => province.id === action.payload.id
      );
      if (index >= 0) {
        state.provinces[index] = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },

    // Update province failure
    updateProvinceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete province success
    deleteProvinceSuccess: (state, action: PayloadAction<string>) => {
      state.provinces = state.provinces.filter(
        (province) => province.id !== action.payload
      );
      state.isLoading = false;
      state.error = null;
    },

    // Delete province failure
    deleteProvinceFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create district success
    createDistrictSuccess: (
      state,
      action: PayloadAction<{ provinceId: string; district: District }>
    ) => {
      const { provinceId, district } = action.payload;
      const provinceIndex = state.provinces.findIndex(
        (province) => province.id === provinceId
      );

      if (provinceIndex >= 0) {
        // Add the district to the province's districts array
        if (!state.provinces[provinceIndex].districts) {
          state.provinces[provinceIndex].districts = [];
        }
        state.provinces[provinceIndex].districts.push(district);
      }

      state.isLoading = false;
      state.error = null;
    },

    // Create district failure
    createDistrictFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update district success
    updateDistrictSuccess: (
      state,
      action: PayloadAction<{ provinceId: string; district: District }>
    ) => {
      const { provinceId, district } = action.payload;
      const provinceIndex = state.provinces.findIndex(
        (province) => province.id === provinceId
      );

      if (provinceIndex >= 0) {
        // Update the district in the province's districts array
        const districtIndex = state.provinces[
          provinceIndex
        ].districts?.findIndex((d) => d.id === district.id);

        if (districtIndex !== undefined && districtIndex >= 0) {
          state.provinces[provinceIndex].districts[districtIndex] = district;
        }
      }

      state.isLoading = false;
      state.error = null;
    },

    // Update district failure
    updateDistrictFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete district success
    deleteDistrictSuccess: (
      state,
      action: PayloadAction<{ provinceId: string; districtId: string }>
    ) => {
      const { provinceId, districtId } = action.payload;
      const provinceIndex = state.provinces.findIndex(
        (province) => province.id === provinceId
      );

      if (provinceIndex >= 0 && state.provinces[provinceIndex].districts) {
        // Remove the district from the province's districts array
        state.provinces[provinceIndex].districts = state.provinces[
          provinceIndex
        ].districts.filter((district) => district.id !== districtId);
      }

      state.isLoading = false;
      state.error = null;
    },

    // Delete district failure
    deleteDistrictFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  clearError,
  fetchProvincesSuccess,
  fetchProvincesFailure,
  fetchProvinceSuccess,
  fetchProvinceFailure,
  createProvinceSuccess,
  createProvinceFailure,
  updateProvinceSuccess,
  updateProvinceFailure,
  deleteProvinceSuccess,
  deleteProvinceFailure,
  createDistrictSuccess,
  createDistrictFailure,
  updateDistrictSuccess,
  updateDistrictFailure,
  deleteDistrictSuccess,
  deleteDistrictFailure,
} = locationsSlice.actions;

export default locationsSlice.reducer;

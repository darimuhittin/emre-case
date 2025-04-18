import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoriesState, Category } from "../../types";
import { ApiResponseMultiple } from "../../services/api.d";
// Initial state
const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

// Categories slice
const categoriesSlice = createSlice({
  name: "categories",
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

    // Fetch categories success
    fetchCategoriesSuccess: (
      state,
      action: PayloadAction<ApiResponseMultiple<Category>>
    ) => {
      state.categories = action.payload.items;
      state.isLoading = false;
      state.error = null;
    },

    // Fetch categories failure
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch category success
    fetchCategorySuccess: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (index >= 0) {
        state.categories[index] = action.payload;
      } else {
        state.categories.push(action.payload);
      }
      state.isLoading = false;
      state.error = null;
    },

    // Fetch category failure
    fetchCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create category success
    createCategorySuccess: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },

    // Create category failure
    createCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update category success
    updateCategorySuccess: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (index >= 0) {
        state.categories[index] = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },

    // Update category failure
    updateCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete category success
    deleteCategorySuccess: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (cat) => cat.id !== action.payload
      );
      state.isLoading = false;
      state.error = null;
    },

    // Delete category failure
    deleteCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  clearError,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchCategorySuccess,
  fetchCategoryFailure,
  createCategorySuccess,
  createCategoryFailure,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategorySuccess,
  deleteCategoryFailure,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

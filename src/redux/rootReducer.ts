import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import listingsReducer from "./slices/listingsSlice";
import locationsReducer from "./slices/locationsSlice";
import categoriesReducer from "./slices/categoriesSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  listings: listingsReducer,
  locations: locationsReducer,
  categories: categoriesReducer,
});

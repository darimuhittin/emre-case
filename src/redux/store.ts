import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./slices/authSlice";
import listingsReducer, {
  createListingRequest,
  updateListingRequest,
  deleteListingRequest,
} from "./slices/listingsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import locationsReducer from "./slices/locationsSlice";
import rootSaga from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingsReducer,
    categories: categoriesReducer,
    locations: locationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [
          createListingRequest.type,
          updateListingRequest.type,
          deleteListingRequest.type,
        ],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

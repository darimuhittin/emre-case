import { takeLatest, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "../../services/apiClient";
import { CategoryFormData } from "../../types";
import {
  setLoading,
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
} from "../slices/categoriesSlice";

// Create action types for saga
export const FETCH_CATEGORIES_REQUEST = "categories/fetchCategoriesRequest";
export const FETCH_CATEGORY_REQUEST = "categories/fetchCategoryRequest";
export const CREATE_CATEGORY_REQUEST = "categories/createCategoryRequest";
export const UPDATE_CATEGORY_REQUEST = "categories/updateCategoryRequest";
export const DELETE_CATEGORY_REQUEST = "categories/deleteCategoryRequest";

// Create action creators for saga
export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoryRequest = (id: string) => ({
  type: FETCH_CATEGORY_REQUEST,
  payload: id,
});

export const createCategoryRequest = (data: CategoryFormData) => ({
  type: CREATE_CATEGORY_REQUEST,
  payload: data,
});

export const updateCategoryRequest = (id: string, data: CategoryFormData) => ({
  type: UPDATE_CATEGORY_REQUEST,
  payload: { id, data },
});

export const deleteCategoryRequest = (id: string) => ({
  type: DELETE_CATEGORY_REQUEST,
  payload: id,
});

// Worker Sagas
function* fetchCategoriesWorker() {
  try {
    yield put(setLoading(true));
    const response = yield call(apiClient.getCategories);
    yield put(fetchCategoriesSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchCategoriesFailure(
        axiosError.response?.data?.message || "Failed to fetch categories"
      )
    );
  }
}

function* fetchCategoryWorker(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    const response = yield call(apiClient.getCategoryById, action.payload);
    yield put(fetchCategorySuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchCategoryFailure(
        axiosError.response?.data?.message || "Failed to fetch category"
      )
    );
  }
}

function* createCategoryWorker(action: PayloadAction<CategoryFormData>) {
  try {
    yield put(setLoading(true));
    const response = yield call(apiClient.createCategory, action.payload);
    yield put(createCategorySuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      createCategoryFailure(
        axiosError.response?.data?.message || "Failed to create category"
      )
    );
  }
}

function* updateCategoryWorker(
  action: PayloadAction<{ id: string; data: CategoryFormData }>
) {
  try {
    yield put(setLoading(true));
    const response = yield call(
      apiClient.updateCategory,
      action.payload.id,
      action.payload.data
    );
    yield put(updateCategorySuccess(response.data));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      updateCategoryFailure(
        axiosError.response?.data?.message || "Failed to update category"
      )
    );
  }
}

function* deleteCategoryWorker(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    yield call(apiClient.deleteCategory, action.payload);
    yield put(deleteCategorySuccess(action.payload));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      deleteCategoryFailure(
        axiosError.response?.data?.message || "Failed to delete category"
      )
    );
  }
}

// Watcher Saga
export function* categoriesSaga() {
  yield all([
    takeLatest(FETCH_CATEGORIES_REQUEST, fetchCategoriesWorker),
    takeLatest(FETCH_CATEGORY_REQUEST, fetchCategoryWorker),
    takeLatest(CREATE_CATEGORY_REQUEST, createCategoryWorker),
    takeLatest(UPDATE_CATEGORY_REQUEST, updateCategoryWorker),
    takeLatest(DELETE_CATEGORY_REQUEST, deleteCategoryWorker),
  ]);
}

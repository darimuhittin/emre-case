import { takeLatest, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "@/services/apiClient";
import {
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
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../slices/categoriesSlice";
import { Category } from "@/types/entities/category";
// Worker Sagas
function* fetchCategoriesWorker() {
  try {
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

function* createCategoryWorker(action: PayloadAction<Category>) {
  try {
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
  action: PayloadAction<{ id: string; data: Category }>
) {
  try {
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
    takeLatest(fetchCategories.type, fetchCategoriesWorker),
    takeLatest(fetchCategory.type, fetchCategoryWorker),
    takeLatest(createCategory.type, createCategoryWorker),
    takeLatest(updateCategory.type, updateCategoryWorker),
    takeLatest(deleteCategory.type, deleteCategoryWorker),
  ]);
}

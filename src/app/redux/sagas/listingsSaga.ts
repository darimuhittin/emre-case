import { takeLatest, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import apiClient from "../../services/apiClient";
import {
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
  // My Listings
  fetchMyListingsRequest,
  fetchMyListingsSuccess,
  fetchMyListingsFailure,
} from "../slices/listingsSlice";
import { navigate } from "../../services/navigationService";
import { ListingFormData } from "../../types";

export const FETCH_LISTING_REQUEST = "listings/fetchListingRequest";
export const DELETE_LISTING_REQUEST = "listings/deleteListingRequest";

export const fetchListingRequest = (slug: string) => ({
  type: FETCH_LISTING_REQUEST,
  payload: slug,
});

export const deleteListingRequest = (id: string) => ({
  type: DELETE_LISTING_REQUEST,
  payload: id,
});

// Workers
function* fetchListingsWorker(
  action: PayloadAction<{
    page?: number;
    categoryId?: string;
    provinceId?: string;
    districtId?: string;
    search?: string;
    userId?: string;
  }>
) {
  try {
    const response = yield call(apiClient.getListings, action.payload);
    console.log(response);
    yield put(fetchListingsSuccess(response));
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchListingsFailure(
        axiosError.response?.data?.message || "Failed to fetch listings"
      )
    );
  }
}

function* fetchListingWorker(action: PayloadAction<string>) {
  try {
    yield put(fetchListingRequestStart());
    const response = yield call(apiClient.getListingBySlug, action.payload);
    yield put(fetchListingSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchListingFailure(
        axiosError.response?.data?.message || "Failed to fetch listing"
      )
    );
  }
}

function* createListingWorker(action: PayloadAction<ListingFormData>) {
  try {
    const { images, ...listingData } = action.payload;
    const response = yield call(apiClient.createListing, {
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      categoryId: listingData.categoryId,
      districtId: listingData.districtId,
    });

    const listing = response;

    // Upload images if provided
    if (images && images.length > 0) {
      for (const image of images) {
        yield call(apiClient.uploadListingImage, listing.id, image);
      }

      yield put(createListingSuccess(listing));
      yield call(navigate, `/listings/${listing.slug}`);
    } else {
      yield put(createListingSuccess(listing));
      yield call(navigate, `/listings/${listing.slug}`);
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      createListingFailure(
        axiosError.response?.data?.message || "Failed to create listing"
      )
    );
  }
}

function* updateListingWorker(
  action: PayloadAction<{
    id: string;
    data: Partial<ListingFormData>;
  }>
) {
  try {
    const { id, data } = action.payload;
    const { images, ...updateData } = data;

    const response = yield call(apiClient.updateListing, id, updateData);
    const listing = response;

    // Upload images if provided
    if (images && images.length > 0) {
      for (const image of images) {
        yield call(apiClient.uploadListingImage, id, image);
      }

      // Refetch the listing to get the updated images
      const updatedResponse = yield call(apiClient.getListingBySlug, id);
      yield put(updateListingSuccess(updatedResponse));
    } else {
      yield put(updateListingSuccess(listing));
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      updateListingFailure(
        axiosError.response?.data?.message || "Failed to update listing"
      )
    );
  }
}

function* deleteListingWorker(action: PayloadAction<string>) {
  try {
    yield put(deleteListingRequestStart());
    yield call(apiClient.deleteListing, action.payload);
    yield put(deleteListingSuccess(action.payload));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      deleteListingFailure(
        axiosError.response?.data?.message || "Failed to delete listing"
      )
    );
  }
}

function* uploadListingImageWorker(
  action: PayloadAction<{
    listingId: string;
    image: File;
  }>
) {
  try {
    const { listingId, image } = action.payload;
    yield call(apiClient.uploadListingImage, listingId, image);

    // Refetch the listing to get the updated images
    const response = yield call(apiClient.getListingBySlug, listingId);
    yield put(uploadListingImageSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      uploadListingImageFailure(
        axiosError.response?.data?.message || "Failed to upload image"
      )
    );
  }
}

function* deleteListingImageWorker(
  action: PayloadAction<{
    listingId: string;
    index: number;
  }>
) {
  try {
    const { listingId, index } = action.payload;
    yield call(apiClient.deleteListingImage, listingId, index);

    // Refetch the listing to get the updated images
    const response = yield call(apiClient.getListingBySlug, listingId);
    yield put(deleteListingImageSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      deleteListingImageFailure(
        axiosError.response?.data?.message || "Failed to delete image"
      )
    );
  }
}

function* fetchMyListingsWorker() {
  try {
    const response = yield call(apiClient.getMyListings);
    console.log(response);
    yield put(fetchMyListingsSuccess(response.items));
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    yield put(
      fetchMyListingsFailure(
        axiosError.response?.data?.message || "Failed to fetch my listings"
      )
    );
  }
}

// Watchers
export function* listingsSaga() {
  yield all([
    takeLatest(fetchListingsRequest.type, fetchListingsWorker),
    takeLatest(FETCH_LISTING_REQUEST, fetchListingWorker),
    takeLatest(createListingRequest.type, createListingWorker),
    takeLatest(updateListingRequest.type, updateListingWorker),
    takeLatest(DELETE_LISTING_REQUEST, deleteListingWorker),
    takeLatest(uploadListingImageRequest.type, uploadListingImageWorker),
    takeLatest(deleteListingImageRequest.type, deleteListingImageWorker),
    takeLatest(fetchMyListingsRequest.type, fetchMyListingsWorker),
  ]);
}

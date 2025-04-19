"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/redux/store";
import ListingCard from "./ListingCard";
import { Listing } from "../../app/types";
import { fetchListingsRequest } from "../../app/redux/slices/listingsSlice";
import ListPagination from "../shared/ListPagination";
import { fetchCategoriesRequest } from "../../app/redux/sagas/categoriesSaga";
import { fetchProvincesRequest } from "../../app/redux/sagas/locationsSaga";
import { setFilters, clearFilters } from "../../app/redux/slices/listingsSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "../ui/input";

const ListingsList: React.FC = () => {
  const dispatch = useDispatch();
  const {
    listings,
    isLoading,
    error,
    filters,
    currentPage,
    totalPages,
    totalListings,
  } = useSelector((state: RootState) => state.listings);

  console.log(filters);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const provinces = useSelector(
    (state: RootState) => state.locations.provinces
  );

  // Fetch ads on component mount
  useEffect(() => {
    dispatch(fetchListingsRequest({ page: 1 }));
    dispatch(fetchCategoriesRequest());
    dispatch(fetchProvincesRequest());
  }, [dispatch]);

  // Handle clear filters
  const handleClearFilters = () => {
    if (filters.search || filters.categoryId || filters.provinceId) {
      dispatch(clearFilters());
    }
  };

  useEffect(() => {
    if (!filters.search && !filters.categoryId && !filters.provinceId) {
      dispatch(fetchListingsRequest({ page: 1 }));
    }
  }, [filters.search, filters.categoryId, filters.provinceId, dispatch]);

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    dispatch(fetchListingsRequest({ page: pageNumber }));
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Browse Advertisements
      </h2>

      {/* Filters */}
      <div className="p-4 rounded-lg shadow-md mb-6 bg-gray-800/60 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search listings..."
              value={filters.search || ""}
              onChange={(e) => {
                dispatch(setFilters({ search: e.target.value }));
              }}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.categoryId || ""}
              onValueChange={(value) => {
                console.log(value);
                dispatch(setFilters({ categoryId: value }));
              }}
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="province">Province</Label>
            <Select
              value={filters.provinceId || ""}
              onValueChange={(value) => {
                console.log(value);
                dispatch(setFilters({ provinceId: value }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                {provinces?.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-0 self-end">
            <Button
              onClick={() => dispatch(fetchListingsRequest(filters))}
              className="ml-2"
            >
              Apply Filters
            </Button>
          </div>

          {(filters.search || filters.categoryId || filters.provinceId) && (
            <div className="flex-0 self-end">
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters (
                {
                  Object.values(filters).filter((value) => value.length > 0)
                    .length
                }
                )
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Skeleton image */}
              <Skeleton className="w-full h-48" />
              {/* Skeleton content */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />
                {/* Price */}
                <Skeleton className="h-5 w-1/3" />
                {/* Description */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                {/* Footer info */}
                <div className="pt-2 flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-white mb-4">
            {totalListings}{" "}
            {totalListings === 1 ? "advertisement" : "advertisements"} found
          </p>

          {/* Ads grid */}
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {listings.map((listing: Listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className=" p-8 rounded-lg text-center bg-gray-800/60 border border-gray-700 ">
              <p className="   text-lg text-white">No advertisements found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            itemsLength={listings.length}
          />
        </>
      )}
    </div>
  );
};

export default ListingsList;

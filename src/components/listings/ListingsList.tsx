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
    dispatch(clearFilters());
  };

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    dispatch(fetchListingsRequest({ page: pageNumber }));
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Browse Advertisements</h2>

      {/* Filters */}
      <div className="bg-secondary-100/90 p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.categoryId || ""}
              onValueChange={(value) => {
                console.log(value);
                dispatch(setFilters({ categoryId: value }));
              }}
            >
              <SelectTrigger className="w-full">
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
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600 text-lg">No advertisements found</p>
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

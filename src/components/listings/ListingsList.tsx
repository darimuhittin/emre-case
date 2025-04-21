"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ListingCard from "./ListingCard";
import { IListingFilters, Listing } from "@/types/entities/listing";
import { fetchListingsRequest } from "@/redux/slices/listingsSlice";

import ListPagination from "@/components/shared/ListPagination";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import { fetchProvinces } from "@/redux/slices/locationsSlice";
import { setFilters } from "@/redux/slices/listingsSlice";
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
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ListingsListSkeleton from "./ListingsListSkeleton";
const ListingsList: React.FC = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [paramsObject, setParamsObject] = useState<IListingFilters>({});
  const router = useRouter();
  const {
    listings,
    isLoading,
    error,
    filters,
    currentPage,
    totalPages,
    totalListings,
  } = useSelector((state: RootState) => state.listings);

  useEffect(() => {
    const page = searchParams.get("page");
    // slug of category
    const category = searchParams.get("category");
    // slug of province
    const province = searchParams.get("province");
    const search = searchParams.get("search");

    const newFilters: IListingFilters = { page: 1 };

    if (page) newFilters.page = parseInt(page);
    if (category) newFilters.category = category;
    if (province) newFilters.province = province;
    if (search) newFilters.search = search;

    setParamsObject(newFilters);
    dispatch(fetchListingsRequest(newFilters));
  }, [searchParams, dispatch]);

  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const provinces = useSelector(
    (state: RootState) => state.locations.provinces
  );

  // Fetch ads on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Handle clear filters
  const handleClearFilters = () => {
    if (filters.search || filters.category || filters.province) {
      setParamsObject({});
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();

    for (const key in paramsObject) {
      if (paramsObject[key as keyof IListingFilters]) {
        params.set(key, paramsObject[key as keyof IListingFilters] as string);
      }
    }

    router.push(`/listings?${params.toString()}`);
  }, [paramsObject, router]);

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    setParamsObject({ ...paramsObject, page: pageNumber });
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log(filters);

  if (isLoading) {
    return <ListingsListSkeleton />;
  }

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
                dispatch(setFilters({ ...filters, search: e.target.value }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setParamsObject({ ...paramsObject, ...filters, page: 1 });
                }
              }}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category || ""}
              onValueChange={(value) => {
                dispatch(setFilters({ ...filters, category: value }));
              }}
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="province">Province</Label>
            <Select
              value={filters.province || ""}
              onValueChange={(value) => {
                dispatch(setFilters({ ...filters, province: value }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a province" />
              </SelectTrigger>
              <SelectContent>
                {provinces?.map((province) => (
                  <SelectItem key={province.id} value={province.slug}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-0 self-end">
            <Button
              onClick={() =>
                setParamsObject({ ...paramsObject, ...filters, page: 1 })
              }
              className="ml-2"
            >
              Apply Filters
            </Button>
          </div>

          {/* Clear filters */}
          {Object.values(filters).filter((value) => value?.length > 0).length >
            0 && (
            <div className="flex-0 self-end">
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters ({" "}
                {
                  Object.values(filters).filter((value) => value?.length > 0)
                    .length
                }{" "}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {listings.map((listing: Listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

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

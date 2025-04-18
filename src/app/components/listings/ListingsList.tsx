import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "../../redux/slices/adsSlice";
import { RootState } from "../../redux/store";
import ListingCard from "./ListingCard";
import { Listing } from "../../types";
import { fetchListingsRequest } from "../../redux/slices/listingsSlice";
import ListPagination from "../../../components/shared/ListPagination";
import { fetchCategoriesRequest } from "../../redux/sagas/categoriesSaga";
import { fetchProvincesRequest } from "../../redux/sagas/locationsSaga";
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

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    filterType: "category" | "province"
  ) => {
    const value = e.target.value === "All" ? "" : e.target.value;

    if (filterType === "category") {
      dispatch(setFilters({ category: value }));
    } else if (filterType === "province") {
      dispatch(setFilters({ province: value }));
    }
  };

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
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.categoryId || "All"}
              onChange={(e) => handleFilterChange(e, "category")}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="province"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Province
            </label>
            <select
              id="province"
              name="province"
              value={filters.provinceId || "All"}
              onChange={(e) => handleFilterChange(e, "province")}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {provinces?.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-0 self-end">
            <button
              onClick={handleClearFilters}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
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
          <p className="text-gray-600 mb-4">
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

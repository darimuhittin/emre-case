import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdsRequest,
  setFilters,
  clearFilters,
} from "../../redux/slices/adsSlice";
import { RootState } from "../../redux/store";
import AdCard from "./AdCard";
import { Ad } from "../../types";

// Mock data for filters
const categories = [
  "All",
  "Electronics",
  "Vehicles",
  "Real Estate",
  "Furniture",
  "Clothing",
  "Services",
  "Jobs",
  "Other",
];

const provinces = ["All", "Istanbul", "Ankara", "Izmir", "Antalya", "Bursa"];

const AdsList: React.FC = () => {
  const dispatch = useDispatch();
  const { filteredAds, isLoading, error, filters } = useSelector(
    (state: RootState) => state.ads
  );

  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 9;

  // Calculate pagination
  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);
  const totalPages = Math.ceil(filteredAds.length / adsPerPage);

  // Fetch ads on component mount
  useEffect(() => {
    dispatch(fetchAdsRequest());
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
    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination controls
  const paginationControls = () => {
    const pages = [];

    // Add previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        &lt;
      </button>
    );

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages || totalPages === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        &gt;
      </button>
    );

    return pages;
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
              value={filters.category || "All"}
              onChange={(e) => handleFilterChange(e, "category")}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
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
              value={filters.province || "All"}
              onChange={(e) => handleFilterChange(e, "province")}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
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
            {filteredAds.length}{" "}
            {filteredAds.length === 1 ? "advertisement" : "advertisements"}{" "}
            found
          </p>

          {/* Ads grid */}
          {currentAds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentAds.map((ad: Ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600 text-lg">No advertisements found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredAds.length > 0 && (
            <div className="flex justify-center mt-8">
              {paginationControls()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdsList;

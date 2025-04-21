"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/redux/store";
import { fetchMyListingsRequest } from "@/redux/slices/listingsSlice";
import ListingCard from "@/components/listings/ListingCard";
import { Listing } from "@/types";

export default function MyListings() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { myListings, isLoading, error } = useSelector(
    (state: RootState) => state.listings
  );

  // Fetch ads on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyListingsRequest());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Listings</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      ) : myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing: Listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="bg-secondary-900 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-lg mb-10">
            You haven&apos;t posted any listings yet
          </p>
          <Link
            href="/listings/create"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors"
          >
            Post Your First Listing
          </Link>
        </div>
      )}
    </div>
  );
}

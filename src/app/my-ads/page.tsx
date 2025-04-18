"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RootState } from "../redux/store";
import { fetchAdsRequest } from "../redux/slices/adsSlice";
import ListingCard from "../components/listings/ListingCard";
import { Ad } from "../types";

export default function MyAds() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { ads, isLoading, error } = useSelector(
    (state: RootState) => state.ads
  );

  // Auth protection - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch ads on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAdsRequest());
    }
  }, [dispatch, isAuthenticated]);

  // Filter ads to only show the user's ads
  const userAds = user ? ads.filter((ad: Ad) => ad.userId === user.id) : [];

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Advertisements</h1>
        <Link
          href="/ads/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Post New Ad
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      ) : userAds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAds.map((ad: Ad) => (
            <ListingCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-lg mb-4">
            You haven&apos;t posted any ads yet
          </p>
          <Link
            href="/ads/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Post Your First Ad
          </Link>
        </div>
      )}
    </div>
  );
}

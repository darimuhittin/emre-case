"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { fetchAdsRequest } from "./redux/slices/adsSlice";
import { RootState } from "./redux/store";
import AdCard from "./components/ads/AdCard";
import { Ad } from "./types";

export default function Home() {
  const dispatch = useDispatch();
  const { ads, isLoading, error } = useSelector(
    (state: RootState) => state.ads
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Fetch ads on component mount
  useEffect(() => {
    dispatch(fetchAdsRequest());
  }, [dispatch]);

  // Get featured/recent ads - for the home page, we'll just show the most recent 6
  const featuredAds = ads.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find What You Need, Sell What You Don&apos;t
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            The easiest way to buy and sell locally. Post an ad for free or find
            what you&apos;re looking for.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/ads"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Ads
            </Link>
            <Link
              href={isAuthenticated ? "/ads/create" : "/login"}
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors"
            >
              {isAuthenticated ? "Post an Ad" : "Login to Post"}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Electronics",
              "Vehicles",
              "Real Estate",
              "Furniture",
              "Clothing",
              "Services",
              "Jobs",
              "Other",
            ].map((category) => (
              <Link
                key={category}
                href={`/ads?category=${category}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {category}
                </h3>
                <p className="text-gray-500 mt-2">Browse {category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Recent Listings</h2>
            <Link
              href="/ads"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : featuredAds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAds.map((ad: Ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">
                No advertisements yet.
              </p>
              <Link
                href={isAuthenticated ? "/ads/create" : "/login"}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                {isAuthenticated ? "Post the First Ad" : "Login to Post"}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up for free and verify your email to get started.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Your Ad</h3>
              <p className="text-gray-600">
                Add photos, description, set price and location.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Make a Deal</h3>
              <p className="text-gray-600">
                Respond to inquiries and complete your sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are buying and selling on our platform.
          </p>
          <Link
            href={isAuthenticated ? "/ads/create" : "/register"}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            {isAuthenticated ? "Post an Ad Now" : "Register for Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}

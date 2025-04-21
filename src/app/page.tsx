"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchListingsRequest } from "@/redux/slices/listingsSlice";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import ListingCard from "@/components/listings/ListingCard";
import { Listing } from "@/types";

export default function Home() {
  const dispatch = useDispatch();
  const { listings, isLoading, error } = useSelector(
    (state: RootState) => state.listings
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { categories } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchListingsRequest({ page: 1 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featuredListings = listings.slice(0, 6);

  return (
    <div className="bg-secondary-900">
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 text-white py-20">
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
              href="/listings"
              className="px-8 py-4 bg-secondary-700 text-white rounded-lg font-bold text-lg hover:bg-secondary-600 transition-colors shadow-lg"
            >
              Browse Listings
            </Link>
            <Link
              href={isAuthenticated ? "/listings/create" : "/login"}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-bold text-lg hover:bg-primary-500 transition-colors shadow-lg"
            >
              {isAuthenticated ? "Post a Listing" : "Login to Post"}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/listings?category=${category.slug}`}
                className="bg-secondary-700 rounded-lg shadow-lg p-6 text-center hover:bg-secondary-600 transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-primary-500"
              >
                <h3 className="text-xl font-semibold text-white">
                  {category.name}
                </h3>
                <p className="text-gray-300 mt-2">Browse {category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">Recent Listings</h2>
            <Link
              href="/listings"
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing: Listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary-800 rounded-lg shadow-xl">
              <p className="text-gray-300 text-lg mb-6">
                No listings available yet.
              </p>
              <Link
                href={isAuthenticated ? "/listings/create" : "/login"}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-500 transition-colors shadow-lg"
              >
                {isAuthenticated ? "Post the First Listing" : "Login to Post"}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-secondary-700 p-8 rounded-lg shadow-lg">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Create an Account
              </h3>
              <p className="text-gray-300">
                Sign up for free and verify your email to get started.
              </p>
            </div>
            <div className="text-center bg-secondary-700 p-8 rounded-lg shadow-lg">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Post Your Listing
              </h3>
              <p className="text-gray-300">
                Add photos, description, set price and location.
              </p>
            </div>
            <div className="text-center bg-secondary-700 p-8 rounded-lg shadow-lg">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Make a Deal
              </h3>
              <p className="text-gray-300">
                Respond to inquiries and complete your sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-900 to-secondary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are buying and selling on our platform.
          </p>
          <Link
            href={isAuthenticated ? "/listings/create" : "/register"}
            className="px-8 py-4 bg-primary-600 text-white rounded-lg font-bold text-lg hover:bg-primary-500 transition-colors shadow-lg"
          >
            {isAuthenticated ? "Post a Listing Now" : "Register for Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}

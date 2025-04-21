"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import ListingForm from "@/components/listings/ListingForm";
import ListingFormSkeleton from "@/components/listings/ListingFormSkeleton";
import { fetchListingRequest } from "@/redux/slices/listingsSlice";

interface EditAdPageProps {
  params: {
    slug: string;
  };
}

export default function EditAdPage({ params }: EditAdPageProps) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedListing } = useSelector((state: RootState) => state.listings);

  const adSlug = params.slug;
  const dispatch = useDispatch();

  // Redirect if not the owner of this ad
  useEffect(() => {
    if (selectedListing && user && selectedListing.user.id !== user.id) {
      router.push(`/listings/${adSlug}`);
    }
  }, [selectedListing, user, adSlug, router]);

  useEffect(() => {
    dispatch(fetchListingRequest(adSlug));
  }, [dispatch, adSlug]);
  if (!selectedListing) {
    return (
      <div className="container mx-auto">
        <ListingFormSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <ListingForm listing={selectedListing} />
    </div>
  );
}

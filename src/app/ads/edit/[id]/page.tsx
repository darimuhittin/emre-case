"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../../../redux/store";
import AdForm from "../../../components/ads/AdForm";
import { getAdRequest } from "../../../redux/slices/adsSlice";

interface EditAdPageProps {
  params: {
    id: string;
  };
}

export default function EditAdPage({ params }: EditAdPageProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { selectedAd, isLoading, error } = useSelector(
    (state: RootState) => state.ads
  );

  const adId = params.id;

  // Auth protection - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch ad data when component mounts
  useEffect(() => {
    if (isAuthenticated && adId) {
      dispatch(getAdRequest(adId));
    }
  }, [dispatch, isAuthenticated, adId]);

  // Redirect if not the owner of this ad
  useEffect(() => {
    if (selectedAd && user && selectedAd.userId !== user.id) {
      router.push(`/ads/${adId}`);
    }
  }, [selectedAd, user, adId, router]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedAd) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Advertisement not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Edit Advertisement
      </h1>
      <AdForm ad={selectedAd} isEditing={true} />
    </div>
  );
}

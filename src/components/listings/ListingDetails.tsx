"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { RootState } from "../../app/redux/store";
import Link from "next/link";
import {
  fetchListingRequest,
  deleteListingRequest,
} from "../../app/redux/sagas/listingsSaga";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import ListingDetailSkeleton from "./ListingDetailSkeleton";

interface AdDetailsProps {
  slug: string;
}

const ListingDetails: React.FC<AdDetailsProps> = ({ slug }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedListing, selectedListingLoading, error } = useSelector(
    (state: RootState) => state.listings
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Fetch ad details on component mount
  useEffect(() => {
    if (slug) {
      dispatch(fetchListingRequest(slug));
    }
  }, [dispatch, slug]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle delete ad
  const handleDeleteAd = () => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      if (selectedListing?.id) {
        dispatch(deleteListingRequest(selectedListing.id));
        router.push("/my-ads");
      } else {
        console.log("No id found");
      }
    }
  };

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on("init", () => {
        carouselApi.scrollTo(0);
      });
    }
  }, [carouselApi]);

  const [slideInView, setSlideInView] = useState(0);

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on("slidesInView", () => {
        setSlideInView(carouselApi.slidesInView()?.[0] || 0);
      });
    }
  }, [carouselApi]);

  // Check if current user is the owner of the ad
  const isOwner =
    user && selectedListing && user.id === selectedListing.user.id;

  if (selectedListingLoading) {
    return <ListingDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedListing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Advertisement not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Home
          </Link>
          {" > "}
          <Link href="/ads" className="text-blue-400 hover:text-blue-300">
            Ads
          </Link>
          {" > "}
          <Link
            href={`/ads?category=${selectedListing.category}`}
            className="text-blue-400 hover:text-blue-300"
          >
            {selectedListing.category.name}
          </Link>
          {" > "}
          <span className="text-gray-300">{selectedListing.title}</span>
        </div>

        <div className="bg-neutral-800 rounded-lg shadow-xl overflow-hidden border border-neutral-700">
          {/* Image carousel */}
          <div className="relative bg-neutral-900">
            {selectedListing.images && selectedListing.images.length > 0 ? (
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {selectedListing.images.map(
                    (image: string, index: number) => (
                      <CarouselItem key={index} className="h-[500px]">
                        <div className="h-[500px] flex items-center justify-center">
                          <Image
                            src={image}
                            alt={`${selectedListing.title} - Image ${index + 1}`}
                            width={1000}
                            height={1000}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-neutral-800/70 hover:bg-neutral-700 border-neutral-600" />
                <CarouselNext className="right-4 bg-neutral-800/70 hover:bg-neutral-700 border-neutral-600" />
              </Carousel>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-neutral-800">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {selectedListing.images && selectedListing.images.length > 1 && (
            <div className="py-3 px-4 bg-neutral-900 flex space-x-2 overflow-x-auto">
              {selectedListing.images.map((image: string, index: number) => (
                <Button
                  variant="ghost"
                  key={index}
                  onClick={() => {
                    carouselApi?.scrollTo(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 p-0 rounded overflow-hidden border-2 ${slideInView === index
                    ? "border-blue-500"
                    : "border-transparent opacity-50"
                    }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-20 h-20 object-contain"
                  />
                </Button>
              ))}
            </div>
          )}

          <div className="p-6">
            {/* Title and price */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2 md:mb-0">
                {selectedListing.title}
              </h1>
              <div className="text-2xl font-bold text-blue-400 bg-blue-900/30 px-4 py-2 rounded-lg">
                {formatPrice(selectedListing.price)}
              </div>
            </div>

            {/* Meta information */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 rounded-full text-sm bg-blue-900/50 text-blue-300 border border-blue-700">
                {selectedListing.category.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-900/50 text-green-300 border border-green-700">
                {selectedListing.district.province.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-purple-900/50 text-purple-300 border border-purple-700">
                {selectedListing.district.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-neutral-800 text-gray-300 border border-neutral-700">
                Posted: {formatDate(selectedListing.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
              <h2 className="text-xl font-semibold text-gray-100 mb-3">
                Description
              </h2>
              <p className="text-gray-300 whitespace-pre-line">
                {selectedListing.description}
              </p>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-neutral-700">
                <Link
                  href={`/ads/edit/${selectedListing.id}`}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center font-medium transition-colors"
                >
                  Edit Advertisement
                </Link>
                <button
                  onClick={handleDeleteAd}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                >
                  Delete Advertisement
                </button>
              </div>
            )}

            {/* Contact button (for non-owners) */}
            {!isOwner && isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-neutral-700">
                <button className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition-colors">
                  Contact Seller
                </button>
              </div>
            )}

            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-neutral-700">
                <p className="mb-4 text-gray-300">
                  You need to be logged in to contact the seller.
                </p>
                <Link href="/login">
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700 transition-colors">
                    Login to Contact
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;

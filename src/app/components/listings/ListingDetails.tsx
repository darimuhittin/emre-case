"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { RootState } from "../../redux/store";
import Link from "next/link";
import {
  fetchListingRequest,
  deleteListingRequest,
} from "../../redux/sagas/listingsSaga";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "../../../components/ui/button";
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
      <div className="mx-auto bg-neutral-50">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          {" > "}
          <Link href="/ads" className="text-blue-600 hover:underline">
            Ads
          </Link>
          {" > "}
          <Link
            href={`/ads?category=${selectedListing.category}`}
            className="text-blue-600 hover:underline"
          >
            {selectedListing.category.name}
          </Link>
          {" > "}
          <span className="text-gray-600">{selectedListing.title}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200">
          {/* Image carousel */}
          <div className="relative bg-gray-200 *:border *:border-neutral-200">
            {selectedListing.images && selectedListing.images.length > 0 ? (
              <Carousel setApi={setCarouselApi}>
                <CarouselContent>
                  {selectedListing.images.map(
                    (image: string, index: number) => (
                      <CarouselItem key={index} className="h-[600px]">
                        <div className="h-[600px]">
                          <Image
                            src={image}
                            alt={`${selectedListing.title} - Image ${
                              index + 1
                            }`}
                            width={1000}
                            height={1000}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : (
              <div className="w-full h-96 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {selectedListing.images && selectedListing.images.length > 1 && (
            <div className="py-2 px-4 bg-gray-100 flex space-x-2 overflow-x-auto">
              {selectedListing.images.map((image: string, index: number) => (
                <Button
                  variant="ghost"
                  key={index}
                  onClick={() => {
                    carouselApi?.scrollTo(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 p-0 rounded overflow-hidden border-2 ${
                    slideInView === index
                      ? "border-primary-500"
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
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">
                {selectedListing.title}
              </h1>
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(selectedListing.price)}
              </div>
            </div>

            {/* Meta information */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                {selectedListing.category.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                {selectedListing.district.province.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                {selectedListing.district.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                Posted: {formatDate(selectedListing.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedListing.description}
              </p>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <Link
                  href={`/ads/edit/${selectedListing.id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center font-medium"
                >
                  Edit Advertisement
                </Link>
                <button
                  onClick={handleDeleteAd}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
                >
                  Delete Advertisement
                </button>
              </div>
            )}

            {/* Contact button (for non-owners) */}
            {!isOwner && isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium">
                  Contact Seller
                </button>
              </div>
            )}

            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="mb-4 text-gray-600">
                  You need to be logged in to contact the seller.
                </p>
                <Link href="/login">
                  <Button variant="default">Login to Contact</Button>
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

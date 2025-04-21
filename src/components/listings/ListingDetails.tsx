"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  fetchListingRequest,
  deleteListingRequest,
} from "../../redux/slices/listingsSlice";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ListingDetailSkeleton from "./ListingDetailSkeleton";
import { getImageUrl } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
    if (selectedListing?.id) {
      dispatch(deleteListingRequest(selectedListing.id));
      router.push("/my-listings");
    } else {
      console.log("No id found");
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
        <div className="mb-6 bg-neutral-800/30 p-3 rounded-lg backdrop-blur-sm flex items-center text-sm">
          <Link
            href="/"
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            Home
          </Link>
          <svg
            className="h-4 w-4 mx-2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            href="/listings"
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            Listings
          </Link>
          <svg
            className="h-4 w-4 mx-2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            href={`/listings?category=${selectedListing.category.slug}`}
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            {selectedListing.category.name}
          </Link>
          <svg
            className="h-4 w-4 mx-2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-300 truncate">
            {selectedListing.title}
          </span>
        </div>

        <div className="bg-neutral-900/30 rounded-xl shadow-2xl overflow-hidden border border-neutral-800/60">
          {/* Image carousel */}
          <div className="relative bg-neutral-950/30">
            {selectedListing.images && selectedListing.images.length > 0 ? (
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {selectedListing.images.map(
                    (image: string, index: number) => (
                      <CarouselItem key={index} className="h-[500px]">
                        <div className="h-[500px] flex items-center justify-center">
                          <Image
                            src={getImageUrl(image)}
                            alt={`${selectedListing.title} - Image ${
                              index + 1
                            }`}
                            width={1000}
                            height={1000}
                            className="object-contain w-full h-full"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-black/50 backdrop-blur-sm hover:bg-black/80 border-neutral-700 transition-all" />
                <CarouselNext className="right-4 bg-black/50 backdrop-blur-sm hover:bg-black/80 border-neutral-700 transition-all" />
              </Carousel>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-neutral-900">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {selectedListing.images && selectedListing.images.length > 1 && (
            <div className="py-3 px-4 bg-neutral-950/40 flex space-x-2 overflow-x-auto">
              {selectedListing.images.map((image: string, index: number) => (
                <Button
                  variant="ghost"
                  key={index}
                  onClick={() => {
                    carouselApi?.scrollTo(index);
                  }}
                  className={`flex-shrink-0 w-16 h-16 p-0 rounded-md overflow-hidden border-2 transition-all ${
                    slideInView === index
                      ? "border-primary-500 shadow-md shadow-primary-500/20"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-20 h-20 object-contain"
                  />
                </Button>
              ))}
            </div>
          )}

          <div className="p-8">
            {/* Title and price */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4 md:mb-0 leading-tight">
                {selectedListing.title}
              </h1>
              <div className="text-2xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 rounded-lg shadow-lg shadow-primary-600/20">
                {formatPrice(selectedListing.price)}
              </div>
            </div>

            {/* Meta information */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-950 text-blue-300 border border-blue-800 shadow-sm">
                {selectedListing.category.name}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm">
                {selectedListing.district.province.name}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-violet-950 text-violet-300 border border-violet-800 shadow-sm">
                {selectedListing.district.name}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-neutral-900 text-gray-300 border border-neutral-800 shadow-sm">
                Posted: {formatDate(selectedListing.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8 bg-neutral-950/30 p-6 rounded-xl border border-neutral-800 shadow-inner">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Description
              </h2>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {selectedListing.description}
              </p>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-neutral-800">
                <Link
                  href={`/listings/edit/${selectedListing.slug}`}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white rounded-lg text-center font-medium transition-all shadow-lg shadow-primary-600/20"
                >
                  Edit Advertisement
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-center font-medium transition-all shadow-lg shadow-red-600/20 cursor-pointer">
                    Delete Advertisement
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-neutral-950/90 border-neutral-800/60">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        This action cannot be undone. This will permanently
                        delete your advertisement and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-neutral-600 cursor-pointer">
                        Cancel Deletion
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAd}
                        className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Contact button (for non-owners) */}
            {!isOwner && isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-neutral-800">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Contact Seller
                </button>
              </div>
            )}

            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-neutral-800 bg-neutral-950 p-6 rounded-xl">
                <p className="mb-5 text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  You need to be logged in to contact the seller.
                </p>
                <Link href="/login">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/20 px-6 py-2.5"
                  >
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

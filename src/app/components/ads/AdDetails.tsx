import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAdRequest, deleteAdRequest } from "../../redux/slices/adsSlice";
import { RootState } from "../../redux/store";
import Link from "next/link";

interface AdDetailsProps {
  id: string;
}

const AdDetails: React.FC<AdDetailsProps> = ({ id }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedAd, isLoading, error } = useSelector(
    (state: RootState) => state.ads
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch ad details on component mount
  useEffect(() => {
    if (id) {
      dispatch(getAdRequest(id));
    }
  }, [dispatch, id]);

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

  // Handle image carousel
  const handlePrevImage = () => {
    if (selectedAd && selectedAd.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedAd.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedAd && selectedAd.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedAd.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Handle delete ad
  const handleDeleteAd = () => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      dispatch(deleteAdRequest(id));
      router.push("/my-ads");
    }
  };

  // Check if current user is the owner of the ad
  const isOwner = user && selectedAd && user.id === selectedAd.userId;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
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

  if (!selectedAd) {
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
      <div className="max-w-4xl mx-auto">
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
            href={`/ads?category=${selectedAd.category}`}
            className="text-blue-600 hover:underline"
          >
            {selectedAd.category}
          </Link>
          {" > "}
          <span className="text-gray-600">{selectedAd.title}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image carousel */}
          <div className="relative h-96 bg-gray-200">
            {selectedAd.images && selectedAd.images.length > 0 ? (
              <>
                <img
                  src={selectedAd.images[currentImageIndex]}
                  alt={selectedAd.title}
                  className="w-full h-full object-contain"
                />

                {selectedAd.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                    </button>

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {selectedAd.images.map((_, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {selectedAd.images && selectedAd.images.length > 1 && (
            <div className="py-2 px-4 bg-gray-100 flex space-x-2 overflow-x-auto">
              {selectedAd.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="p-6">
            {/* Title and price */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">
                {selectedAd.title}
              </h1>
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(selectedAd.price)}
              </div>
            </div>

            {/* Meta information */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                {selectedAd.category}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                {selectedAd.province}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                {selectedAd.district}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                Posted: {formatDate(selectedAd.createdAt)}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedAd.description}
              </p>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <Link
                  href={`/ads/edit/${selectedAd.id}`}
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
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                >
                  Login to Contact
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;

import React from "react";
import { useRouter } from "next/navigation";
import { Listing } from "../../types";
import Image from "next/image";
interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const router = useRouter();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  // Navigate to listing details
  const handleClick = () => {
    router.push(`/listings/${listing.slug}`);
  };

  if (!listing) return null;

  return (
    <div
      className="bg-secondary-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:-translate-y-1 cursor-pointer border-t-4 border-primary-500"
      onClick={handleClick}
    >
      <div className="relative h-48">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        ) : (
          <div className="w-full h-full bg-secondary-700 flex items-center justify-center">
            <span className="text-secondary-400">No image</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-lg font-bold text-white truncate">
            {listing.title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-primary-400">
            {formatPrice(listing.price)}
          </span>
          <span className="text-sm text-gray-400">
            {formatDate(listing.createdAt)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          <span className="px-2 py-1 text-xs rounded-full bg-primary-700 text-white">
            {listing.category?.name || "Uncategorized"}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-secondary-700 text-gray-300">
            {listing.district?.province?.name || "Unknown location"}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-secondary-600 text-gray-300">
            {listing.district?.name || ""}
          </span>
        </div>

        <p className="text-gray-300 text-sm line-clamp-2">
          {listing.description}
        </p>
      </div>
    </div>
  );
};

export default ListingCard;

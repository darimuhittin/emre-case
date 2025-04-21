import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Edit, Trash } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteListingRequest } from "@/redux/slices/listingsSlice";
import { Listing } from "../../types/entities/listing";

interface IProps {
  listing: Listing;
}

const ListingCard: React.FC<IProps> = ({ listing }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("USER ID : ", user?.id);
  console.log("LISTING USER ID ", listing.user.id);
  const isOwner = user?.id === listing.user?.id;

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

  // Navigate to edit page
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
    router.push(`/listings/edit/${listing.slug}`);
  };

  const handleDeleteAd = () => {
    dispatch(deleteListingRequest(listing.id));
  };

  if (!listing) return null;

  return (
    <div
      className="bg-secondary-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:-translate-y-1 cursor-pointer border-t-4 border-primary-500 relative"
      onClick={handleClick}
    >
      {isOwner && (
        <div className="absolute top-2 right-2 z-20 space-x-2">
          <button
            onClick={handleEditClick}
            className="bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200 cursor-pointer"
            aria-label="Edit listing"
            title="Edit listing"
          >
            <Edit size={16} />
          </button>
          <AlertDialog>
            <AlertDialogTrigger
              className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash size={16} />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-neutral-950/30 border-neutral-800/60">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  This action cannot be undone. This will permanently delete
                  your advertisement and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="text-neutral-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Cancel Deletion
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAd();
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      <div className="relative h-48">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={getImageUrl(listing.images[0])}
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

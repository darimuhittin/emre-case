import React from "react";
import { useRouter } from "next/navigation";
import { Ad } from "../../types";

interface AdCardProps {
  ad: Ad;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
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

  // Navigate to ad details
  const handleClick = () => {
    router.push(`/ads/${ad.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48">
        {ad.images && ad.images.length > 0 ? (
          <img
            src={ad.images[0]}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-lg font-bold text-white truncate">{ad.title}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(ad.price)}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(ad.createdAt)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            {ad.category}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            {ad.province}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            {ad.district}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{ad.description}</p>
      </div>
    </div>
  );
};

export default AdCard;

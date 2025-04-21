import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ListingsListSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Browse Advertisements
      </h2>

      {/* Filters skeleton */}
      <div className="p-4 rounded-lg shadow-md mb-6 bg-gray-800/60 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-0 self-end">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>

      {/* Results count skeleton */}
      <Skeleton className="h-5 w-40 mb-4" />

      {/* Listings grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Skeleton image */}
            <Skeleton className="w-full h-48" />
            {/* Skeleton content */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <Skeleton className="h-6 w-3/4" />
              {/* Price */}
              <Skeleton className="h-5 w-1/3" />
              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              {/* Footer info */}
              <div className="pt-2 flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-6">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
};

export default ListingsListSkeleton;

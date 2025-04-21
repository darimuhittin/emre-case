import { Skeleton } from "@/components/ui/skeleton";

const ListingDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12 bg-gray-700/40" />
          <span className="text-gray-500">&gt;</span>
          <Skeleton className="h-4 w-8 bg-gray-700/40" />
          <span className="text-gray-500">&gt;</span>
          <Skeleton className="h-4 w-20 bg-gray-700/40" />
          <span className="text-gray-500">&gt;</span>
          <Skeleton className="h-4 w-32 bg-gray-700/40" />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
          {/* Image carousel skeleton */}
          <div className="relative bg-gray-700">
            <div className="h-96">
              <Skeleton className="w-full h-full bg-gray-700/60" />
            </div>
          </div>

          {/* Thumbnails skeleton */}
          <div className="py-2 px-4 bg-gray-800 flex space-x-2 overflow-x-auto">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton
                key={index}
                className="flex-shrink-0 w-16 h-16 rounded bg-gray-700/60"
              />
            ))}
          </div>

          <div className="p-6">
            {/* Title and price skeleton */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <Skeleton className="h-10 w-3/4 mb-2 md:mb-0 bg-gray-700/60" />
              <Skeleton className="h-8 w-32 bg-gray-700/60" />
            </div>

            {/* Meta information skeleton */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full bg-gray-700/60" />
              <Skeleton className="h-6 w-24 rounded-full bg-gray-700/60" />
              <Skeleton className="h-6 w-24 rounded-full bg-gray-700/60" />
              <Skeleton className="h-6 w-36 rounded-full bg-gray-700/60" />
            </div>

            {/* Description skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-2 bg-gray-700/60" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-700/60" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-700/60" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-700/60" />
              <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700/60" />
            </div>

            {/* Action buttons skeleton */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <Skeleton className="h-10 w-full sm:w-40 bg-gray-700/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailSkeleton;

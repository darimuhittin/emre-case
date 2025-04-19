import { Skeleton } from "@/components/ui/skeleton";

const ListingDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className=" mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <span className="text-gray-300">&gt;</span>
          <Skeleton className="h-4 w-8" />
          <span className="text-gray-300">&gt;</span>
          <Skeleton className="h-4 w-20" />
          <span className="text-gray-300">&gt;</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image carousel skeleton */}
          <div className="relative bg-gray-200">
            <div className="h-96">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* Thumbnails skeleton */}
          <div className="py-2 px-4 bg-gray-100 flex space-x-2 overflow-x-auto">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton
                key={index}
                className="flex-shrink-0 w-16 h-16 rounded"
              />
            ))}
          </div>

          <div className="p-6">
            {/* Title and price skeleton */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <Skeleton className="h-10 w-3/4 mb-2 md:mb-0" />
              <Skeleton className="h-8 w-32" />
            </div>

            {/* Meta information skeleton */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-full" />
            </div>

            {/* Description skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
            </div>

            {/* Action buttons skeleton */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Skeleton className="h-10 w-full sm:w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailSkeleton;

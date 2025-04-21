import { Skeleton } from "@/components/ui/skeleton";
import { Tag, DollarSign, MapPinned, Image as ImageIcon } from "lucide-react";

const ListingFormSkeleton = () => {
  return (
    <div className="p-8 backdrop-filter">
      <div className="space-y-8">
        <div className="pb-6 border-b border-gray-700">
          <Skeleton className="h-8 w-64 bg-gray-700/60 mb-2" />
          <Skeleton className="h-4 w-96 bg-gray-700/60" />
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <Tag className="h-5 w-5 text-indigo-400" />
              </div>
              <Skeleton className="h-6 w-40 bg-gray-700/60" />
            </div>

            <div className="pl-12 space-y-6">
              {/* Title */}
              <div>
                <Skeleton className="h-4 w-24 bg-gray-700/60 mb-2" />
                <Skeleton className="h-10 w-full bg-gray-700/60" />
              </div>

              {/* Description */}
              <div>
                <Skeleton className="h-4 w-32 bg-gray-700/60 mb-2" />
                <Skeleton className="h-32 w-full bg-gray-700/60" />
              </div>
            </div>
          </div>

          {/* Category & Price Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <DollarSign className="h-5 w-5 text-indigo-400" />
              </div>
              <Skeleton className="h-6 w-48 bg-gray-700/60" />
            </div>

            <div className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <Skeleton className="h-4 w-24 bg-gray-700/60 mb-2" />
                <Skeleton className="h-10 w-full bg-gray-700/60" />
              </div>

              {/* Price */}
              <div>
                <Skeleton className="h-4 w-24 bg-gray-700/60 mb-2" />
                <Skeleton className="h-10 w-full bg-gray-700/60" />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <MapPinned className="h-5 w-5 text-indigo-400" />
              </div>
              <Skeleton className="h-6 w-32 bg-gray-700/60" />
            </div>

            <div className="pl-12">
              <Skeleton className="h-4 w-24 bg-gray-700/60 mb-2" />
              <Skeleton className="h-10 w-full bg-gray-700/60" />
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <ImageIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <Skeleton className="h-6 w-24 bg-gray-700/60" />
            </div>

            <div className="pl-12 space-y-6">
              <Skeleton className="h-40 w-full rounded-lg bg-gray-700/60" />

              {/* Image previews */}
              <div className="mt-6">
                <Skeleton className="h-4 w-32 bg-gray-700/60 mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="aspect-square bg-gray-700/60 rounded-md"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-700">
          <div className="flex justify-end">
            <Skeleton className="h-12 w-40 bg-gray-700/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingFormSkeleton;

import React from "react";
import ListingForm from "@/components/listings/ListingForm";

export default function CreateListing() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Post a New Listing
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Create your professional listing and reach our community of interested
          buyers.
        </p>
      </div>

      <ListingForm />
    </div>
  );
}

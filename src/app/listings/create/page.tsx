import React from "react";
import ListingForm from "@/components/listings/ListingForm";

export default function CreateListing() {
  return (
    <div className="container mx-auto py-10 px-4 ">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Post a New Listing
      </h1>
      <ListingForm />
    </div>
  );
}

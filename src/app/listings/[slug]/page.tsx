"use client";

import React from "react";
import ListingDetails from "@/components/listings/ListingDetails";

interface AdPageProps {
  params: {
    slug: string;
  };
}

export default function AdPage({ params }: AdPageProps) {
  return (
    <div className="py-8 ">
      <ListingDetails slug={params.slug} />
    </div>
  );
}

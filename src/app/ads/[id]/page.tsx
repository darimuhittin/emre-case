"use client";

import React from "react";
import AdDetails from "../../components/ads/AdDetails";

interface AdPageProps {
  params: {
    id: string;
  };
}

export default function AdPage({ params }: AdPageProps) {
  return (
    <div className="py-8">
      <AdDetails id={params.id} />
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RootState } from "@/redux/store";
import { logoutRequest } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Plus,
  LogOut
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );


  const handleLogout = () => {
    dispatch(logoutRequest());
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
      </div>

      <div className="bg-gradient-to-b from-navy-800 to-navy-900 text-gray-100">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white/80  border-b border-gray-700 pb-2">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-navy-700  rounded-lg shadow-md">
              <p className="text-primary-300 text-sm mb-1">Email Address</p>
              <p className="font-medium text-white">{user.email}</p>
            </div>
            <div className="bg-navy-700  rounded-lg shadow-md">
              <p className="text-primary-300 text-sm mb-1">Account Created</p>
              <p className="font-medium text-white">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Invalid Date"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white/80  border-b border-gray-700 pb-2">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/my-listings"
              className="px-6 py-3 bg-primary-900 hover:bg-primary-800 text-blue-100 rounded-lg text-center transition-colors duration-200 shadow-md flex items-center justify-center"
            >
              <LayoutGrid className="h-5 w-5 mr-2" />
              My Advertisements
            </Link>
            <Link
              href="/listings/create"
              className="px-6 py-3 bg-green-800 hover:bg-green-700 text-green-100 rounded-lg text-center transition-colors duration-200 shadow-md flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post New Ad
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-white/80  border-b border-gray-700 pb-2">Account Actions</h2>
          <div>
            <Button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg flex items-center transition-colors duration-200 shadow-md"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

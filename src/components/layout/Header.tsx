"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { logoutRequest } from "@/redux/slices/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserCircle, LogOut } from "lucide-react";
const Header: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
    router.push("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="bg-secondary-800 shadow-lg border-b border-secondary-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white flex-1">
            <Image src="/logo.png" alt="logo" width={80} height={20} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <Link href="/" className="text-gray-300 hover:text-primary-400">
              Home
            </Link>
            <Link
              href="/listings"
              className="text-gray-300 hover:text-primary-400"
            >
              Browse Listings
            </Link>
          </nav>

          {/* User menu (desktop) */}
          {isAuthLoading ? (
            <div className="flex-1 justify-end flex">
              <Skeleton className="w-8 h-8 rounded-full self-end" />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end h-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="default"
                    className="text-gray-300 hover:text-primary-400"
                    onClick={() => router.push("/listings/create")}
                  >
                    Post a Listing
                  </Button>
                  <div className="relative">
                    <button
                      className="flex items-center text-gray-300 hover:text-primary-400"
                      onClick={toggleDropdown}
                    >
                      <UserCircle className="h-8 w-8" />
                    </button>
                    {dropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-0"
                          onClick={closeDropdown}
                        ></div>
                        <div className="absolute right-0 w-48 bg-secondary-700 border-secondary-600 text-gray-300 rounded-md shadow-lg z-10 overflow-hidden">
                          <div className="h-2 absolute -top-2 left-0 right-0"></div>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 cursor-pointer hover:bg-secondary-600"
                            onClick={closeDropdown}
                          >
                            My Profile
                          </Link>
                          <Link
                            href="/my-listings"
                            className="block px-4 py-2 cursor-pointer hover:bg-secondary-600"
                            onClick={closeDropdown}
                          >
                            My Listings
                          </Link>
                          <div
                            onClick={() => {
                              handleLogout();
                              closeDropdown();
                            }}
                            className="flex items-center text-gray-300 hover:bg-secondary-600 cursor-pointer px-4 py-2 hover:text-red-500"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>Logout</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-300 hover:text-primary-400"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden fixed inset-0 bg-black bg-opacity-75 z-50">
            <div className="bg-secondary-800 h-full w-3/4 p-4 overflow-y-auto">
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center mb-6">
                <Link
                  href="/"
                  className="text-2xl font-bold text-primary-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AdPlatform
                </Link>
                <button
                  className="text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile menu items */}
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/listings"
                  className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Listings
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/listings/create"
                      className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post a Listing
                    </Link>
                    <Link
                      href="/profile"
                      className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/my-ads"
                      className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Ads
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full cursor-pointer hover:bg-secondary-600"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

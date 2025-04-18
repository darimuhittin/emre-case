import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState } from "../../redux/store";
import { logoutRequest } from "../../redux/sagas/authSaga";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
    router.push("/");
  };

  return (
    <header className="bg-secondary-800 shadow-lg border-b border-secondary-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-500">
            AdPlatform
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-primary-400">
              Home
            </Link>
            <Link href="/ads" className="text-gray-300 hover:text-primary-400">
              Browse Ads
            </Link>
          </nav>

          {/* User menu (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/ads/create"
                  className="text-gray-300 hover:text-primary-400"
                >
                  Post an Ad
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-300 hover:text-primary-400">
                    <span className="mr-1">{user?.email}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary-700 border border-secondary-600 hidden group-hover:block z-50">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-300 hover:bg-secondary-600"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-ads"
                        className="block px-4 py-2 text-gray-300 hover:bg-secondary-600"
                      >
                        My Ads
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-secondary-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
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
                  href="/ads"
                  className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Ads
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/ads/create"
                      className="text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post an Ad
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
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-gray-300 hover:bg-secondary-700 px-4 py-2 rounded-md w-full"
                    >
                      Logout
                    </button>
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

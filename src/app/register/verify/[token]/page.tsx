"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { verifyEmailRequest } from "../../../redux/sagas/authSaga";
import { RootState } from "../../../redux/store";
import { Check, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmail() {
  const dispatch = useDispatch();
  const params = useParams();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [verified, setVerified] = useState(false);

  const token = params.token as string;
  useEffect(() => {
    dispatch(verifyEmailRequest(token));
  }, [token]);

  useEffect(() => {
    if (!isLoading && !error) {
      setVerified(true);
    }
  }, [isLoading, error]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verifying your email</h2>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center">
          <AlertTriangle className="h-16 w-16 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 mb-6">
            The verification link may have expired or is invalid. Please try
            registering again or contact support.
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Register Again
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Login
            </Link>
          </div>
        </div>
      );
    }

    if (verified) {
      return (
        <div className="flex flex-col items-center justify-center">
          <Check className="h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now log in to
            your account.
          </p>
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login to Your Account
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Email Verification
        </h1>
        {renderContent()}
      </div>
    </div>
  );
}

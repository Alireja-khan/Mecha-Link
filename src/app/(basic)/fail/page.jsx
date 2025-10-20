"use client";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function FailPage() {
  const params = useSearchParams();

  const paymentInfo = {
    tran_id: params.get("tran_id"),
    error: params.get("error") || "Payment failed due to an unexpected issue.",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <XCircle className="text-red-600 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Sorry! Your payment could not be completed. <br />
          Please try again later.
        </p>

        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-left">
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Failure Details
          </h2>
          <p className="text-gray-700">
            <strong>Transaction ID:</strong>{" "}
            {paymentInfo.tran_id || "Not available"}
          </p>
          <p className="text-gray-700">
            <strong>Reason:</strong> {paymentInfo.error}
          </p>
        </div>

        <Link
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

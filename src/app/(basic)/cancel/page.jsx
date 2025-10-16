"use client";
import { useSearchParams } from "next/navigation";
import { XOctagon } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  const params = useSearchParams();

  const paymentInfo = {
    tran_id: params.get("tran_id"),
    message: params.get("message") || "You have cancelled the payment.",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <XOctagon className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-yellow-600 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          {paymentInfo.message}
        </p>

        {paymentInfo.tran_id && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-left">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">Transaction Info</h2>
            <p className="text-gray-700">
              <strong>Transaction ID:</strong> {paymentInfo.tran_id}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

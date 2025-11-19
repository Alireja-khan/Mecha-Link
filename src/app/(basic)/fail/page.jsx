"use client";
import { useSearchParams } from "next/navigation";
import { XCircle, Home, User } from "lucide-react";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Loader from "../loading";

export default function FailPage() {
  const params = useSearchParams();
  const { user: loggedInUser, isLoading } = useUser();

  const paymentInfo = {
    tran_id: params.get("tran_id") || "Not Found",
    message: params.get("error") || "Payment failed due to an unexpected issue. Please try again or contact support.",
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="bg-base-200 shadow-xl rounded-2xl p-6 w-full max-w-lg text-center border border-base-300">

        <XCircle className="text-error w-16 h-16 mx-auto mb-6" />

        <h1 className="text-3xl font-extrabold text-base-content mb-3">
          Payment Failed
        </h1>
        <p className="text-lg text-base-content/60 mb-8">
          We're sorry, but your payment could **not be completed**. No funds were charged to your account.
        </p>

        <div className="bg-error/20 border border-error p-4 rounded-lg mb-6 text-center">
          <p className="text-md text-error font-semibold">
            Failure Reason:
          </p>
          <p className="text-base-content mt-1 italic">
            "{paymentInfo.message}"
          </p>
        </div>

        {paymentInfo.tran_id && paymentInfo.tran_id !== "Not Found" && (
          <div className="bg-base-300/50 p-3 rounded-lg mb-6 text-center text-sm">
            <p className="text-base-content/80">
              **Transaction ID:** <span className="font-mono text-base-content font-bold select-all">{paymentInfo.tran_id}</span>
            </p>
            <p className="text-xs text-base-content/50 mt-1">
              Please provide this ID if you contact support.
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-base-300">
          <h2 className="text-xl font-semibold text-base-content mb-4">What's Next?</h2>
          <div className="flex flex-col space-y-3">
            <Link
              href={'/'}
              className="bg-primary rounded-lg w-full text-white px-6 py-2.5 text-lg font-medium flex items-center gap-2 justify-center hover:bg-primary/80"
            >
              <User></User>
              Back to Home
            </Link>
          </div>
          <p className="text-sm text-base-content/60 mt-4">
            If this issue persists, please check your payment method details or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
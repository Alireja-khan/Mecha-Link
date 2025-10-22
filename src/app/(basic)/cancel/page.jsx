"use client";
import { useSearchParams } from "next/navigation";
import { XOctagon, Home, User } from "lucide-react";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import Loader from "../loading";

export default function CancelPage() {
  const params = useSearchParams();
  const { user: loggedInUser, isLoading } = useUser();

  const paymentInfo = {
    tran_id: params.get("tran_id") || "Not Found",
    message: params.get("message") || "The payment process was closed or manually cancelled.",
  };

  let redirectLink = "/";
  let redirectText = "Back to Home";
  let RedirectIconComponent = Home;

  if (!isLoading && loggedInUser && loggedInUser.role) {
    redirectLink = `/dashboard/${loggedInUser.role}/profile`;
    redirectText = "Back to Profile";
    RedirectIconComponent = User;
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="bg-base-200 shadow-xl rounded-2xl p-6 w-full max-w-lg text-center border border-base-300">

        <XOctagon className="text-warning w-16 h-16 mx-auto mb-6" />

        <h1 className="text-3xl font-extrabold text-base-content mb-3">
          Payment Cancelled
        </h1>
        <p className="text-lg text-base-content/60 mb-8">
          You have successfully **cancelled the payment process**. No charges have been made to your account.
        </p>

        <div className="bg-warning/20 border border-warning p-4 rounded-lg mb-6 text-center">
          <p className="text-md text-warning font-semibold">
            Cancellation Message:
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
              Note this ID if you contact support.
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-base-300">
          <h2 className="text-xl font-semibold text-base-content mb-4">What's Next?</h2>
          <div className="flex flex-col space-y-3">
            <Link
              href={redirectLink}
              className="bg-primary rounded-lg text-lg w-full text-white px-6 py-2.5 font-medium flex items-center justify-center hover:bg-primary/80"
            >
              <RedirectIconComponent className="w-5 h-5 mr-2" />
              {redirectText}
            </Link>
          </div>
          <p className="text-sm text-base-content/60 mt-4">
            If you need to try the payment again, please navigate back to the item you were trying to purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
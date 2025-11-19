"use client";

import { useState } from "react";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import newsletterAnimation from "../../../public/assets/subscribing/subscribing.json";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUnsubscribeView, setIsUnsubscribeView] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (isUnsubscribeView) {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to unsubscribe ${email}? You’ll stop receiving all updates.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "hsl(var(--color-error))",
        cancelButtonColor: "hsl(var(--color-neutral))",
        confirmButtonText: "Yes, Unsubscribe",
        cancelButtonText: "Cancel",
      }).then((result) => {
        setLoading(false);
        if (result.isConfirmed) {
          setTimeout(() => {
            Swal.fire({
              title: "Unsubscribed",
              text: `${email} has been removed from our newsletter.`,
              icon: "success",
              confirmButtonColor: "hsl(var(--color-primary))",
            });
            resetForm();
          }, 500);
        } else {
          resetForm();
        }
      });
    } else {
      setTimeout(() => {
        setLoading(false);
        Swal.fire({
          title: "Welcome 🎉",
          text: `Thanks for subscribing, ${email}! Stay tuned for updates.`,
          icon: "success",
          confirmButtonColor: "hsl(var(--color-primary))",
        });
        resetForm();
      }, 1500);
    }
  };

  const resetForm = () => {
    setEmail("");
    setIsUnsubscribeView(false);
  };

  const handleToggleUnsubscribe = () => {
    setIsUnsubscribeView(true);
    setEmail("");
  };

  const handleCancelUnsubscribe = () => {
    setIsUnsubscribeView(false);
    setEmail("");
  };

  const titleText = isUnsubscribeView
    ? "Unsubscribe Our <span class='text-primary'>Newsletter</span>"
    : `Join <span class='text-primary'>Mechalink's</span> Newsletter`;

  const descriptionText = isUnsubscribeView
    ? "Enter the email you want to remove from our mailing list."
    : "Subscribe to get exclusive updates, offers, and insights directly in your inbox.";

  const buttonText = isUnsubscribeView ? "Unsubscribe" : "Join Now";
  const inputPlaceholder = isUnsubscribeView
    ? "Enter email to unsubscribe"
    : "Enter your email";

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-base-100 ">
      <div className="lg:container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-content/10">

          {/* LEFT SIDE */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-14 text-center lg:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-base-content leading-tight font-urbanist"
              dangerouslySetInnerHTML={{ __html: titleText }}
            />
            <p className="text-base sm:text-lg text-base-content/70 mb-8 font-poppins max-w-md mx-auto lg:mx-0">
              {descriptionText}
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full mx-auto lg:mx-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={inputPlaceholder}
                aria-label="Email address"
                className="flex-1 px-5 py-3 rounded-xl border-2 border-base-300 placeholder:text-base-content/40 text-base-content bg-base-200 text-sm sm:text-base focus:outline-none focus:border-primary"
                required
                disabled={loading}
              />

              <button
                type="submit"
                className={`lg:px-3 sm:px-8 xl:px-6  py-3 rounded-xl text-primary-content font-semibold text-base sm:text-lg hover:opacity-90 shadow-md disabled:opacity-70 disabled:cursor-not-allowed ${isUnsubscribeView
                    ? "bg-error hover:bg-error/90"
                    : "bg-primary hover:bg-primary/90"
                  }`}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-primary-content mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  buttonText
                )}
              </button>
            </form>

            <p className="mt-6 text-xs sm:text-sm text-base-content/60 font-poppins max-w-md mx-auto lg:mx-0">
              {isUnsubscribeView ? (
                <span>
                  Changed your mind?
                  <button
                    onClick={handleCancelUnsubscribe}
                    type="button"
                    className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors underline underline-offset-2 rounded px-1 -mx-1"
                  >
                    Go back to subscribe
                  </button>
                </span>
              ) : (
                <span>
                  We respect your privacy.
                  <button
                    onClick={handleToggleUnsubscribe}
                    type="button"
                    className="ml-0.5 text-base-content/70 hover:text-secondary font-medium transition-colors underline underline-offset-2 rounded px-1 -mx-1"
                  >
                    Unsubscribe here
                  </button>
                </span>
              )}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-1/2 lg:flex items-center justify-center hidden">
            <Lottie
              animationData={newsletterAnimation}
              loop={true}
              className="h-80 md:h-[400px] lg:h-[500px] w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

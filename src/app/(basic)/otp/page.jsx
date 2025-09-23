"use client";

import Lottie from "lottie-react";
import otpIllustration from "../../../../public/assets/login/login.json"; 
import OTPForm from "./OTPForm/OTPForm";
import FadeIn from "react-fade-in/lib/FadeIn";

export default function OTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex max-w-5xl w-full">
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-6">
          <Lottie
            animationData={otpIllustration}
            loop={true}
            className="w-full h-full max-w-md"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <FadeIn>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Verify OTP
            </h2>
            <OTPForm />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

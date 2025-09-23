"use client";

import Lottie from "lottie-react";
import forgotIllustration from "../../../../public/assets/login/login.json"; 
import ForgetPassForm from "./components/ForgetPassForm";
import FadeIn from "react-fade-in/lib/FadeIn";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex max-w-5xl w-full">
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-6">
          <Lottie
            animationData={forgotIllustration}
            loop={true}
            className="w-full h-full max-w-md"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <FadeIn>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Forgot Password
            </h2>
            <ForgetPassForm />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

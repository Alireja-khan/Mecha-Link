"use client";

import Lottie from "lottie-react";
import loginIllustration from "../../../public/assets/login/login.json"; 
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex max-w-5xl w-full">
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-6">
          <Lottie animationData={loginIllustration} loop={true} className="w-full h-full max-w-md" />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  );
}

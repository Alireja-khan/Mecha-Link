"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SocialLogin from "../../login/components/SocialLogin";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Eye, EyeOff } from "lucide-react";
import FadeIn from "react-fade-in/lib/FadeIn";
import Link from "next/link";

export default function RegisterFrom() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const uploaded = await uploadImageToImgbb(image);
    setProfileImage(uploaded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  console.log(profileImage);

  return (
    <form onSubmit={handleSubmit}>
      <FadeIn>
      <div className="mb-4">
        <label htmlFor="imageInput">
          <div className="flex items-center justify-center mt-2 gap-2">
            {profileImage ? (
              <img
                src={profileImage}
                alt="preview"
                className="w-28 h-28 object-cover rounded-full border border-primary p-2"
              />
            ) : (
              <img
                className="w-28 h-28 object-cover mx-auto rounded-full border border-primary cursor-pointer"
                src="https://i.ibb.co.com/990my6Yq/avater.png"
              />
            )}
          </div>
          <div className="flex justify-center mt-2 cursor-pointer">
            {!profileImage && <p>Upload your picture</p>}
          </div>
        </label>
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          onChange={handleImageUpload}
          className="w-full border border-neutral rounded p-2 hidden"
        />
      </div>

      <div>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
        />
      </div>

      {/* Password field with toggle */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white font-semibold py-2 rounded-md transition cursor-pointer mb-4"
      >
        Sign Up
      </button>

      <p className="text-center">Or Sign Up With</p>
      <SocialLogin />

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
      </FadeIn>
    </form>
  );
}
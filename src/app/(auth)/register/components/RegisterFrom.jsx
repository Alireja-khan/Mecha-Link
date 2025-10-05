"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SocialLogin from "../../login/components/SocialLogin";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterFrom() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const uploaded = await uploadImageToImgbb(image);
    setProfileImage(uploaded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");

    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());
    formObj.profileImage = profileImage;
    formObj.createdAt = new Date();
    formObj.role = "user";
    formObj.loginAttempts = 0;
    formObj.lockUntil = null;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(formObj.password)) {
      setLoading(false);
      setPasswordError(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
      );
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formObj),
      });

      const data = await response.json();

      if (data.insertedId) {
        // send OTP
        await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formObj.email }),
        });
        toast.success("OTP send on your mail");
        router.push(`/otp?email=${formObj.email}`);
      } else {
        setLoading(false);
        setPasswordError(data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setPasswordError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Profile image upload */}
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

      {/* Name */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
          required
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
          required
        />
      </div>

      {/* Password with toggle */}
      <div className="relative mb-1">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Password Error */}
      {passwordError && (
        <p className="text-red-500 text-sm mb-3">{passwordError}</p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-primary text-white font-semibold py-2 rounded-md transition cursor-pointer mb-4 mt-3 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Sign Up"}
      </button>

      <p className="text-center">Or Sign Up With</p>
      <SocialLogin />

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

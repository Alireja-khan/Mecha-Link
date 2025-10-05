"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SocialLogin from "../../login/components/SocialLogin";
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Eye, EyeOff, User, Wrench } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterFrom() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [selectedRole, setSelectedRole] = useState("user"); // Default role

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    
    // Validate image size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate image type
    if (!image.type.startsWith('image/')) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setLoading(true);
      const uploaded = await uploadImageToImgbb(image);
      setProfileImage(uploaded);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");

    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!formObj.name?.trim() || !formObj.email?.trim() || !formObj.password) {
      setLoading(false);
      setPasswordError("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObj.email)) {
      setLoading(false);
      setPasswordError("Please enter a valid email address");
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formObj.password)) {
      setLoading(false);
      setPasswordError(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
      );
      return;
    }

    // Prepare user data
    const userData = {
      name: formObj.name.trim(),
      email: formObj.email.toLowerCase().trim(),
      password: formObj.password,
      profileImage: profileImage,
      role: selectedRole,
      createdAt: new Date(),
      loginAttempts: 0,
      lockUntil: null,
      status: "pending", // Will be verified after OTP
      provider: "credentials"
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.success) {
        // Send OTP for verification
        const otpResponse = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: userData.email,
            name: userData.name,
            role: userData.role 
          }),
        });

        if (!otpResponse.ok) {
          throw new Error("Failed to send OTP");
        }

        toast.success(`OTP sent to your email. Welcome ${userData.name}!`);
        router.push(`/otp?email=${userData.email}&role=${userData.role}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setPasswordError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile image upload */}
      <div className="mb-6 text-center">
        <label htmlFor="imageInput" className="cursor-pointer">
          <div className="flex items-center justify-center mt-2 gap-2">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile preview"
                className="w-28 h-28 object-cover rounded-full border-2 border-primary p-1"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <User size={32} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex justify-center mt-3">
            <span className="text-sm text-gray-600 hover:text-primary transition-colors">
              {profileImage ? "Change picture" : "Upload your picture"}
            </span>
          </div>
        </label>
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          onChange={handleImageUpload}
          className="hidden"
          disabled={loading}
        />
      </div>

      {/* Role Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Register as:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole("user")}
            className={`flex items-center justify-center p-3 border rounded-lg transition-all ${
              selectedRole === "user"
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <User size={18} className="mr-2" />
            Regular User
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("mechanic")}
            className={`flex items-center justify-center p-3 border rounded-lg transition-all ${
              selectedRole === "mechanic"
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Wrench size={18} className="mr-2" />
            Mechanic
          </button>
        </div>
      </div>

      {/* Name */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          required
          disabled={loading}
          minLength={2}
          maxLength={50}
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          required
          disabled={loading}
        />
      </div>

      {/* Password with toggle */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create password"
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 transition-all"
          required
          disabled={loading}
          minLength={8}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={loading}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Password Error */}
      {passwordError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{passwordError}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-primary text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center ${
          loading
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-primary/90 transform hover:-translate-y-0.5"
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </>
        ) : (
          `Sign Up as ${selectedRole === "mechanic" ? "Mechanic" : "User"}`
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <SocialLogin />

      <p className="text-center text-sm mt-6 text-gray-600">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="text-primary hover:underline font-medium transition-colors"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
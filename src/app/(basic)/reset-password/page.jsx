"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import Lottie from "lottie-react";
import resetIllustration from "../../../../public/assets/login/login.json";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;

    // ✅ Password validation with regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
      );
      return;
    }

    setError(""); // clear error if password is valid

    try {
      setLoading(true);

      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Password reset successful",
        });
        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Password reset failed",
        });
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex max-w-5xl w-full">
        {/* Left Side Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-6">
          <Lottie
            animationData={resetIllustration}
            loop={true}
            className="w-full h-full max-w-md"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* ❌ Error Message */}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary font-semibold text-white py-2 rounded-md transition cursor-pointer mb-4 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-center text-sm mt-2">
              Back to{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
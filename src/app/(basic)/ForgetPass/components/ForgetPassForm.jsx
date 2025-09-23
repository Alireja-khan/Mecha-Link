"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import FadeIn from "react-fade-in/lib/FadeIn";
import Link from "next/link";

export default function ForgetPassForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Please enter your email",
      });
      return;
    }

    try {
      setLoading(true);
      // TODO: call your backend API to send reset link
      // await sendResetLink({ email });

      Swal.fire({
        icon: "success",
        title: "Reset link sent to your email",
      });

      // Optionally redirect back to login
      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FadeIn>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary font-semibold text-white py-2 rounded-md transition cursor-pointer mb-4 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center text-sm mt-2">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </p>
      </FadeIn>
    </form>
  );
}

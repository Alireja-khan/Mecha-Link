"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function OTPForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // ✅ safely extract email (avoid window error on SSR)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setEmail(params.get("email"));
    }
  }, []);

  const handleChange = (e) => {
    setOtp(e.target.value.replace(/\D/, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (data.success) {
        // ✅ Show success alert first
        await Swal.fire({
          icon: "success",
          title: "Registration Successful 🎉",
          text: "Your email has been verified. You can now log in.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Go to Login",
        });

        // ✅ Redirect after user clicks confirm
        router.push("/login");
      } else {
        Swal.fire("Invalid OTP", data.message || "Please try again", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire("New OTP Sent", "Check your email.", "success");
    } else {
      Swal.fire("Failed", "Could not send OTP", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="text"
          name="otp"
          maxLength={6}
          value={otp}
          onChange={handleChange}
          placeholder="Enter 6-digit OTP"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 text-center tracking-widest text-lg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary font-semibold text-white py-2 rounded-md transition cursor-pointer mb-4 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-center text-sm">
        Didn’t receive the code?{" "}
        <button
          type="button"
          className="text-primary hover:underline cursor-pointer"
          onClick={handleResend}
        >
          Resend OTP
        </button>
      </p>
    </form>
  );
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function OTPForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setOtp(e.target.value.replace(/\D/, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter a valid 6-digit code.",
      });
      return;
    }

    try {
      setLoading(true);
      // TODO: call your backend API to verify OTP
      // await verifyOTP({ otp });

      Swal.fire({
        icon: "success",
        title: "OTP Verified Successfully",
      });

      router.push("/"); // redirect after success
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "OTP Verification Failed",
        text: "Please try again.",
      });
    } finally {
      setLoading(false);
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
            className="text-primary hover:underline"
            onClick={() => Swal.fire("New OTP Sent", "Check your email or phone.", "success")}
          >
            Resend OTP
          </button>
        </p>
    </form>
  );
}

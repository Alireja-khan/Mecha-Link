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
    const email = new URLSearchParams(window.location.search).get("email");

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (data.success) router.push("/login");
    else alert(data.message);
  };

  const handleResend = async () => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@example.com" }),
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
            onClick={() => handleResend()}
          >
            Resend OTP
          </button>
        </p>
    </form>
  );
}

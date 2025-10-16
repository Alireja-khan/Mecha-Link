"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

export default function BecomeMechanic() {

const router = useRouter();
  const handlePayment = async () => {
    const res = await fetch("/api/ssl/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Omar Faruk",
        email: "omar@example.com",
        phone: "01700000000",
        amount: 1000,
      }),
    });

    const data = await res.json();
    console.log(data)

    if (data.GatewayPageURL) {
      router.push(data.GatewayPageURL);
    } else {
      alert("Failed to initialize payment!");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6 font-semibold">SSLCommerz Payment</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  )
}

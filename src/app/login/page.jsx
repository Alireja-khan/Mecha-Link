"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    setUser({
      name: formData.name,
      email: formData.email,
      avatar: "/default-avatar.png", // fallback avatar
    });

    alert("User Logged In!");
    router.push("/"); // redirect home
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

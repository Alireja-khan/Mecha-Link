"use client";
import { registerUser } from "@/app/actions/auth/registerUser";
import SocialLogin from "@/app/login/components/SocialLogin";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function RegisterFrom() {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    toast("Please wait.....");
    try {
      const res = await registerUser({ name, email, password });
      if (res.ok) {
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        toast.success("Registration successful! ✅");
        router.push("/products");
        form.reset();
      } else {
        toast.error(res.message || "Registration failed ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1"
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-white hover:bg-gray-300 text-black py-2 rounded-md transition cursor-pointer"
      >
        Sign Up
      </button>

      <p className="text-center">Or Sign Up With</p>
      {/* Social Sign Up */}
      <SocialLogin></SocialLogin>
      {/* Login Link */}
      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}

"use client";
import React from "react";
// import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const form = e.target;
    // const email = form.email.value;
    // const password = form.password.value;
    // toast("Please wait.....");
    // try {
    //   const response = await signIn("credentials", {
    //     email,
    //     password,
    //     callbackUrl: "/",
    //     redirect: false,
    //   });
    //   //console.log({email, password});
    //   if (response.ok) {
    //     toast.success("Logged In SuccessFully");
    //     router.push("/products");
    //     form.reset();
    //   } else {
    //     toast.error("Failed to Logged In");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Failed to Logged In");
    // }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Your password"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-white hover:bg-gray-300 text-black py-2 rounded-md transition cursor-pointer"
      >
        Sign In
      </button>

      {/* Social Login */}
      <p className="text-center">Or Sign In With</p>
      {/* <SocialLogin></SocialLogin> */}

      {/* Sign Up Link */}
      <p className="text-center text-sm mt-6">
        Don't Have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
}

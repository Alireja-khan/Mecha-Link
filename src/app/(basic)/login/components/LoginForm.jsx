"use client";
import { useState } from "react";
// import { signIn, signOut } from "next-auth/react";
import { userCredentials } from "@/app/actions/authActions";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const router = useRouter();
  const { update } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const formData = { email, password };
    try {
      const response = await userCredentials(formData);
      if (!response.success) {
        Swal.fire({
          icon: "error",
          title: response.message || "Invalid username or password",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Login successful",
        })
        await update();
        router.push("/"); 
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      })
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
          />
        </div>

        {/* Password field with toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Your password"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
            Remember me
          </label>

          <Link href="/ForgetPass" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-primary font-semibold text-white py-2 rounded-md transition cursor-pointer mb-4"
        >
          Log in
        </button>

        {/* Social Login */}
        <p className="text-center">Or Sign in With</p>
        <SocialLogin />

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-6">
          Don't Have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
    </form>
  );
}

"use client";
import { useState } from "react";
import { userCredentials } from "@/app/actions/authActions";
import { Eye, EyeOff, User, Wrench } from "lucide-react"; // Import necessary icons
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import SocialLogin from "./SocialLogin";

const DEMO_CREDENTIALS = {
  admin: {
    email: "ali2reja@gmail.com",
    password: "Al123456@",
    role: "Admin",
  },
  mechanic: {
    email: "mechanic5@gmail.com",
    password: "Mechanic@123",
    role: "Mechanic",
  },
};

export default function LoginForm() {
  const router = useRouter();
  const { update } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoginType, setDemoLoginType] = useState(null);

  const fillFormWithDemo = (demoType, form) => {
    const data = DEMO_CREDENTIALS[demoType];
    if (data) {
      form.email.value = data.email;
      form.password.value = data.password;
      setDemoLoginType(demoType);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const formData = { email, password };

    try {
      const response = await userCredentials(formData);

      if (!response.success) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.message || "Invalid email or password",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
      });
      await update();
      router.push("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Demo Credentials Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Load Demo Credentials:
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={(e) => fillFormWithDemo("admin", e.currentTarget.form)}
            className={`flex items-center justify-center p-3 border rounded-lg transition-all text-sm ${
              demoLoginType === "admin"
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-300 hover:border-gray-400 text-gray-700"
            }`}
          >
            <User size={18} className="mr-2" />
            Admin
          </button>
          <button
            type="button"
            onClick={(e) => fillFormWithDemo("mechanic", e.currentTarget.form)}
            className={`flex items-center justify-center p-3 border rounded-lg transition-all text-sm ${
              demoLoginType === "mechanic"
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-300 hover:border-gray-400 text-gray-700"
            }`}
          >
            <Wrench size={18} className="mr-2" />
            Mechanic
          </button>
        </div>
      </div>
      
      {/* Email Field */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
          required
        />
      </div>

      {/* Password field with toggle */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Your password"
          className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary focus:border-transparent pr-10 transition-all"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
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
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          Remember me
        </label>

        <Link href="/ForgetPass" className="text-primary hover:underline font-medium">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="w-full bg-primary font-semibold text-white py-2 rounded-md transition hover:bg-primary/90 transform hover:-translate-y-0.5 mb-4"
      >
        Log in
      </button>

      {/* Social Login Separator */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or sign in with</span>
        </div>
      </div>

      <SocialLogin />

      {/* Sign Up Link */}
      <p className="text-center text-sm mt-6 text-gray-600">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
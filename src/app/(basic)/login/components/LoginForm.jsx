"use client";
import { useRouter } from "next/navigation";
import { userCredentials } from "@/app/actions/authAction";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const {update} = useSession();
  const router = useRouter();

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
      console.log(error);
    }
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
    </form>
  );
}

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SocialLogin from "../../login/components/SocialLogin";
<<<<<<< HEAD
import {uploadImageToImgbb} from "@/lib/uploadImgbb";
import Swal from "sweetalert2";
import Link from "next/link";
=======
import { uploadImageToImgbb } from "@/lib/uploadImgbb";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133

export default function RegisterFrom() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const uploaded = await uploadImageToImgbb(image);
    setProfileImage(uploaded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());
    formObj.profileImage = profileImage;
    formObj.createdAt = new Date();
<<<<<<< HEAD
    formObj.role= "user";
=======
    formObj.role = "user";
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObj),
    })
    const data = await response.json();
<<<<<<< HEAD
    if(data.insertedId){
      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text:"You can login now",
      })
      router.push("/login");
    }else if(!data.success){
=======
    if (data.insertedId) {
      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: "You can login now",
      })
      router.push("/login");
    } else if (!data.success) {
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: data.message,
      })
    }
  };
<<<<<<< HEAD
=======

>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
  return (
    <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="imageInput">
            <div className="flex items-center justify-center mt-2 gap-2">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="preview"
                  className="w-28 h-28 object-cover rounded-full border border-primary p-2"
                />
              ) : (
                <img
                  className="w-28 h-28 object-cover mx-auto rounded-full border border-primary cursor-pointer"
                  src="https://i.ibb.co.com/990my6Yq/avater.png"
                />
              )}
            </div>
            <div className="flex justify-center mt-2 cursor-pointer">
              {!profileImage && <p>Upload your picture</p>}
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            id="imageInput"
            onChange={handleImageUpload}
            className="w-full border border-neutral rounded p-2 hidden"
          />
        </div>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-1 mb-4"
          />
        </div>

<<<<<<< HEAD
=======
        {/* Password field with toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
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
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133

        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-2 rounded-md transition cursor-pointer mb-4"
        >
          Sign Up
        </button>

<<<<<<< HEAD
      <p className="text-center">Or Sign Up With</p>
      <SocialLogin></SocialLogin>
      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
=======
        <p className="text-center">Or Sign Up With</p>
        <SocialLogin />

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
    </form>
  );
}
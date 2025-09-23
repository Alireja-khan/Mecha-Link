"use client";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import SocialLogin from "../../login/components/SocialLogin";
import {uploadImageToImgbb} from "@/lib/uploadImgbb";
import Swal from "sweetalert2";
import Link from "next/link";

export default function RegisterFrom() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
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
    formObj.role= "user";
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObj),
    })
    const data = await response.json();
    if(data.insertedId){
      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text:"You can login now",
      })
      router.push("/login");
    }else if(!data.success){
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: data.message,
      })
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="imageInput">
          <div className=" flex items-center justify-center mt-2 gap-2">
            {profileImage ? (
              <img
                src={profileImage}
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <img
                className="w-24 h-24 object-cover rounded mx-auto"
                src="https://i.ibb.co.com/990my6Yq/avater.png"
              />
            )}
          </div>
          {!profileImage && <p>Upload your picture</p>}
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
      <SocialLogin></SocialLogin>
      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}

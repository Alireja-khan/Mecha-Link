"use client";

import { userSocialLogin } from "@/app/actions/authActions";
import { FaGoogle, FaGithub } from "react-icons/fa";


export default function SocialLogin() {
  return (
    <div className="mt-6 flex justify-center">
      <div style={{ display: "flex", gap: "40px", fontSize: "24px" }}>
        <button
          onClick={() => userSocialLogin("google")}
          className="bg-white text-black p-3 rounded-full cursor-pointer"
        >
          <FaGoogle type="button"/>
        </button>
        <button
          onClick={() => userSocialLogin("github")}
          className="bg-white text-black p-3 rounded-full cursor-pointer"
        >
          <FaGithub type="button"/>
        </button>
      </div>
    </div>
  );
}

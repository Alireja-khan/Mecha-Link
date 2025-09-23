"use client";

import { userSocialLogin } from "@/app/actions/authActions";
import { FaGoogle, FaGithub } from "react-icons/fa";


export default function SocialLogin() {
  return (
    <div className="mt-6 flex justify-center">
<<<<<<< HEAD
      <div style={{ display: "flex", gap: "40px", fontSize: "24px" }}>
        <button type="button"
=======
      <div style={{ display: "flex", gap: "20px", fontSize: "24px" }}>
        <button
          type="button"
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
          onClick={() => userSocialLogin("google")}
          className="bg-primary text-white p-3 rounded-full cursor-pointer"
        >
          <FaGoogle />
        </button>
<<<<<<< HEAD
        <button type="button"
=======
        <button
          type="button"
>>>>>>> 33088b2b3f824cb282715d8d26246c423e1d4133
          onClick={() => userSocialLogin("github")}
          className="bg-primary text-white p-3 rounded-full cursor-pointer"
        >
          <FaGithub />
        </button>
      </div>
    </div>
  );
}

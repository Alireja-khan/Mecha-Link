"use server";

import { signIn, signOut } from "@/auth";
import getUserData from "@/lib/getUserData";
import bcrypt from "bcrypt";
export async function userSocialLogin(provider) {
  await signIn(provider, { redirectTo: "/" });
}

export async function userCredentials(formData) {
  const { email, password } = formData;
  const user =await getUserData(email);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const passCheck= await bcrypt.compare(password, user.password || "");
  if(!passCheck) {
    return { success: false, message: "Invalid password" };
  }
  try {
     await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, message: "Login successful" };
  } catch (err) {
    return { success: false, message:"Something went wrong" };
  }
}


export async function userLogout() {
  await signOut();
}
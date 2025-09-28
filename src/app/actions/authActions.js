"use server";

import { signIn, signOut } from "@/auth";
import getUserData from "@/lib/getUserData";
import bcrypt from "bcrypt";
import dbConnect, { collections } from "@/lib/dbConnect";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export async function userCredentials(formData) {
  const { email, password } = formData;
  const collection = await dbConnect(collections.users);
  // const user = await getUserData(email);


  // Find user
  const user = await collection.findOne({ email });
  if (!user) {
    return { success: false, message: "User not found" };
  }


  // const passCheck = await bcrypt.compare(password, user.password || "");
  // if(!passCheck) {
  //   return { success: false, message: "Invalid password" };
  // }
  
  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutes = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
    return { success: false, message: `Account locked. Try again in ${minutes} min.` };
  }

  const passCheck = await bcrypt.compare(password, user.password || "");
  if (!passCheck) {
    const attempts = (user.loginAttempts || 0) + 1;
    const update = { loginAttempts: attempts };

    if (attempts >= MAX_ATTEMPTS) {
      update.lockUntil = Date.now() + LOCK_TIME;
      update.loginAttempts = 0; 
    }

    await collection.updateOne({ email }, { $set: update });

    return { success: false, message: "Invalid password" };
  }

  // ✅ Password correct: reset attempts
  await collection.updateOne(
    { email },
    { $set: { loginAttempts: 0 }, $unset: { lockUntil: "" } }
  );

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, message: "Login successful" };
  } catch (err) {
    return { success: false, message: "Something went wrong" };
  }
}

export async function userSocialLogin(provider) {
  await signIn(provider, { redirectTo: "/" });
}

export async function userLogout() {
  await signOut();
}
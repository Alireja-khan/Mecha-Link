"use server";


import { signIn, signOut } from "@/auth";
import { clientPromise } from "@/lib/dbConnect";
import bcrypt from "bcrypt";

const MAX_ATTEMPTS = 3; // lock after 3 wrong attempts
const LOCK_TIME = 10 * 60 * 1000; // 10 minutes

// Social login
export async function userSocialLogin(provider) {
  await signIn(provider, { redirectTo: "/" });
}

// Credentials login
export async function userCredentials(formData) {
  const { email, password } = formData;
  const db = clientPromise.db(process.env.DB_NAME); 
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // ⛔ Check if locked & lockUntil still valid
  if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
    return { success: false, message: "Account locked. Try again later." };
  }

  const passCheck = await bcrypt.compare(password, user.password || "");

  if (!passCheck) {
    // increase failed attempts
    const attempts = (user.failedAttempts || 0) + 1;
    let updateData = { failedAttempts: attempts };

    // lock if reached max attempts
    if (attempts >= MAX_ATTEMPTS) {
      updateData.isLocked = true;
      updateData.lockUntil = new Date(Date.now() + LOCK_TIME);
    }

    await usersCollection.updateOne({ email }, { $set: updateData });

    return { success: false, message: "Invalid password" };
  }

  // ✅ Correct password → reset failedAttempts
  await usersCollection.updateOne(
    { email },
    { $set: { failedAttempts: 0, isLocked: false, lockUntil: null } }
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

// 🔹 Logout
export async function userLogout() {
  await signOut();
}

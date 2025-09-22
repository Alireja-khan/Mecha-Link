"use server";

import { signIn, signOut } from "@/auth";
const users = [
  {
    id: 1,
    email: "admin@example.com",
    password: "1234",
  },
  {
    id: 2,
    email: "user@example.com",
    password: "1234",
  },
  {
    id: 3,
    email: "mechanic@example.com",
    password: "1234",
  },
];

const findEmail = (email) => {
  return users.find((user) => user.email === email);
};
export async function userSocialLogin(provider) {
  await signIn(provider, { redirectTo: "/" });
}

export async function userCredentials(formData) {
  const { email, password } = formData;
  const user = findEmail(email);
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if(user.password !== password) {
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
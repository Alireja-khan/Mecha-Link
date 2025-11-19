import { auth } from "@/providers/auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;

  // Fetch additional user data if needed
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users?id=${session.user.id}`);
  const userData = await res.json();
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: userData.role || "user",
    ...userData
  };
}

"use client";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  const {user: loggedInUser, status} = useUser();
  
    console.log(loggedInUser);

  const role = loggedInUser?.role; // "admin" | "mechanic" | "user"
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "mechanic") router.push("/dashboard/mechanic");
      // else router.push("/dashboard/user");

  return <p className="p-8">Loading dashboard...</p>;
}
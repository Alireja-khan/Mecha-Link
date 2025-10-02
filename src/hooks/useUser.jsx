"use client";
import getUserData from "@/lib/getUserData";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function useUser() {
  const [user, setUser] = useState(null);
  const {data: session, status} = useSession()
  useEffect(() => {
    if (!session?.user?.email) return;
    (async () => {
      const data = await getUserData(session?.user?.email);
      setUser(data);
    })();
  }, [session?.user?.email]);

  return {user, status};
}
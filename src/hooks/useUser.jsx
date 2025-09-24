"use client";
import getUserData from "@/lib/getUserData";
import { useState, useEffect } from "react";

export default function useUser(userEmail) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userEmail) return;
    (async () => {
      const data = await getUserData(userEmail);
      setUser(data);
    })();
  }, [userEmail]);

  return user;
}
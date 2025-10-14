"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { RiRobot3Line } from "react-icons/ri";

export default function AskToAIButton() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { user: loggedInUser, status } = useUser();
  const role = loggedInUser?.role || "user";

  // Show button after scrolling a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setIsVisible(true);
      else setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => router.push(`/dashboard/${role}/AskAI`)}
      className="fixed bottom-20 right-6 p-3 rounded-full bg-primary text-white shadow-lg hover:opacity-90 transition duration-300 flex items-center justify-center cursor-pointer z-50"
      aria-label="Go to Ask to AI page"
    >
      <RiRobot3Line size={20} />
    </button>
  );
}

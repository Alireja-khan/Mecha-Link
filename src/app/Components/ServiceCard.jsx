"use client";

import { useState } from "react";
import useUser from "@/hooks/useUser";
import { CalendarHeart, Clock, MapPinPlus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service }) {
  const { user: loggedInUser } = useUser();
  const [loadingChat, setLoadingChat] = useState(false);

  // ------------------------------
  // 📨 Handle chat creation
  // ------------------------------
  const handleMessageUser = async () => {
    if (!loggedInUser) {
      alert("You must log in to send a message.");
      return;
    }

    // 🧩 Extract shop owner info from service data
    const ownerEmail = service?.shop?.ownerEmail || service?.userEmail;
    const ownerName = service?.shop?.ownerName || "Shop Owner";
    const ownerImage =
      service?.shop?.logo ||
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

    if (!ownerEmail) {
      alert("Shop owner information missing.");
      return;
    }

    try {
      setLoadingChat(true);

      const payload = {
        participants: [
          {
            userId: ownerEmail, // since your data doesn’t store _id
            email: ownerEmail,
            name: ownerName,
            profileImage: ownerImage,
          },
          {
            userId: loggedInUser._id || loggedInUser.email,
            email: loggedInUser.email,
            name: loggedInUser.name || "User",
            profileImage:
              loggedInUser.profileImage ||
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          },
        ],
      };

      const res = await fetch(`/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create chat");

      console.log("Chat created or found:", result);

      // Redirect to messages page
      const userRole = loggedInUser?.role?.toLowerCase() || "user";
      window.location.href = `/dashboard/${userRole}/messages`;
    } catch (err) {
      console.error("Chat open error:", err);
      alert("Failed to open chat.");
    } finally {
      setLoadingChat(false);
    }
  };

  // ------------------------------
  // 🧱 UI Rendering
  // ------------------------------
  return (
    <div className="bg-base-200 p-3 border border-base-300 rounded-xl overflow-hidden shadow-lg shadow-base-100 h-full flex flex-col group relative">
      {/* Rating */}
      <div className="absolute z-10 shrink-0 text-right flex items-center gap-1 justify-center bg-base-200 top-4 right-4 rounded-xl px-2">
        <Star size={18} strokeWidth={1.25} className="text-primary" />{" "}
        {service.avgRating ? service.avgRating : "0"}/5
      </div>

      {/* Service Image */}
      <div className="h-60 w-full rounded-lg overflow-hidden relative">
        <Image
          fill
          src={
            service.shop.logo ||
            "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          className="object-cover group-hover:scale-110 duration-500 object-top"
          alt={service.shop.shopName || "shop"}
        />
      </div>

      {/* Service Info */}
      <div className="flex-1 p-3">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold truncate">
            {service.shop.shopName}
          </h2>
        </div>

        <div className="text-lg mt-3 truncate">
          <span className="font-semibold">Category:</span>{" "}
          <button
            className="truncate text-primary"
          >
            {service.shop.categories[0]}
          </button>
        </div>

        <div className="space-y-1">
          <div className="text-base mt-3 flex gap-2 items-center">
            <MapPinPlus
              strokeWidth={1.25}
              className="w-6 h-6 text-2xl text-primary shrink-0"
            />
            <p className="truncate">
              Location: {service.shop.address.street || ""}{" "}
              {service.shop.address.city || ""} {" - "}
              {service.shop.address.postalCode || ""}
            </p>
          </div>

          <p className="text-base flex gap-2 items-center truncate">
            <Clock strokeWidth={1.25} className="w-6 h-6 text-primary shrink-0" />
            Working Hour: {service.shop.workingHours.open || ""} {" - "}{" "}
            {service.shop.workingHours.close || ""}
          </p>

          <p className="text-base flex gap-2 items-center truncate">
            <CalendarHeart
              strokeWidth={1.25}
              className="w-6 h-6 text-primary shrink-0"
            />
            Weekend: {service.shop.workingHours.weekend}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2 border-t border-primary p-3 w-full mt-auto">
        <button
          onClick={handleMessageUser}
          disabled={loadingChat}
          className={`w-1/2 py-3 ${loadingChat
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-secondary"
            } text-white font-bold text-lg capitalize leading-none font-urbanist rounded-md transition duration-400 text-center truncate`}
        >
          {loadingChat ? "Opening..." : "Contact"}
        </button>

        <Link
          className="w-1/2 py-3 border border-primary hover:bg-primary/10 text-primary font-bold text-lg capitalize leading-none font-urbanist rounded-md transition duration-400 text-center truncate"
          href={`/services/${service._id}`}
        >
          Shop Details
        </Link>
      </div>
    </div>
  );
}
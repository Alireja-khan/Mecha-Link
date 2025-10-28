"use client";

import { useState } from "react";
import useUser from "@/hooks/useUser";
import { CalendarHeart, Clock, MapPinPlus, Star, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ServiceCard({ service }) {
  const { user: loggedInUser } = useUser();
  const [loadingChat, setLoadingChat] = useState(false);

  const handleMessageUser = async () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'You must be logged in to start a chat.',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    const ownerEmail = service?.shop?.ownerEmail || service?.userEmail;
    
    if (!ownerEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Shop owner information is missing.',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    setLoadingChat(true);

    try {
      const ownerResponse = await fetch(`/api/users?email=${encodeURIComponent(ownerEmail)}`);
      if (!ownerResponse.ok) {
        throw new Error("Failed to fetch shop owner data.");
      }
      const ownerDataArray = await ownerResponse.json();
      const ownerUser = Array.isArray(ownerDataArray) ? ownerDataArray[0] : ownerDataArray;

      if (!ownerUser?._id) {
          throw new Error("Shop owner ID not found.");
      }
      
      const ownerId = ownerUser._id;
      const ownerName = ownerUser.name || service?.shop?.shopName || "Shop Owner";
      const ownerImage = ownerUser.profileImage || service?.shop?.logo || 
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

      if (loggedInUser._id === ownerId) {
          Swal.fire({
            icon: 'warning',
            title: 'Action Blocked',
            text: 'You cannot message your own service listing.',
            confirmButtonColor: '#f97316'
          });
          return;
      }
      
      const loggedInUserRole = loggedInUser.role?.toLowerCase() || "user";
      
      const chatRes = await fetch(`/api/chats?userId=${loggedInUser._id}`);
      if (!chatRes.ok) throw new Error('Failed to fetch user chats');
      const userChats = await chatRes.json();

      const existingChat = userChats.find(chat =>
          chat.participants?.some(p => p.userId === ownerId) &&
          chat.participants?.some(p => p.userId === loggedInUser._id)
      );
      
      if (existingChat) {
          window.location.href = `/dashboard/${loggedInUserRole}/messages?chatId=${existingChat._id}`;
          return;
      }

      const payload = {
        participants: [
          {
            userId: ownerId,
            email: ownerEmail,
            name: ownerName,
            profileImage: ownerImage,
          },
          {
            userId: loggedInUser._id,
            email: loggedInUser.email,
            name: loggedInUser.name || "User",
            profileImage: loggedInUser.profileImage ||
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          },
        ],
        serviceId: service._id
      };

      const res = await fetch(`/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create chat");

      window.location.href = `/dashboard/${loggedInUserRole}/messages?chatId=${result._id}`;
      
    } catch (err) {
      console.error("Chat open error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Chat Error',
        text: err.message || 'Failed to open chat.',
        confirmButtonColor: '#f97316'
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="bg-base-200 p-3 border border-base-300 rounded-xl overflow-hidden shadow-lg shadow-base-100 h-full flex flex-col group relative">
      <div className="absolute z-10 shrink-0 text-right flex items-center gap-1 justify-center bg-base-200 top-4 right-4 rounded-xl px-2">
        <Star size={18} strokeWidth={1.25} className="text-primary" />{" "}
        {service.avgRating ? service.avgRating : "0"}/5
      </div>

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

        <div className="space-y-2">
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

      <div className="flex justify-between gap-2 border-t border-gray-200 p-3 w-full mt-auto">
        <button
          onClick={handleMessageUser}
          disabled={loadingChat}
          className={`w-1/2 py-3 ${loadingChat
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-secondary"
            } text-white font-bold text-lg capitalize leading-none font-urbanist rounded-md transition duration-400 text-center truncate flex items-center justify-center gap-2`}
        >
          {loadingChat ? <><MessageSquare className="w-5 h-5 animate-pulse" /> Opening...</> : <><MessageSquare className="w-5 h-5" /> Contact</>}
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
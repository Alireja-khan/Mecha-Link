import {CalendarHeart, Clock, MapPinPlus, Star} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ServiceCard({service}) {
  console.log(service)
  return (
    <div>
      <div
        key={service.id}
        className="border border-primary rounded-xl overflow-hidden shadow-md h-full flex flex-col group"
      >
        {/* service Image */}
        <div className="h-60 w-full overflow-hidden relative">
          <Image
            fill
            src={service.shop.logo || ""}
            className="object-cover group-hover:scale-120 duration-500 object-top"
            alt={service.shop.shopName || ""}
            // width={500}
          />
        </div>

        {/* service Info */}
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">{service.shop.shopName}</h2>
            <p className="w-14 shrink-0 text-right flex items-center gap-2">
              <Star strokeWidth={1.25} className="w-6 text-primary" />{" "}
              {service.avgRating? service.avgRating : "0"}/5
            </p>
          </div>
          <p className="text-lg mt-3">
            <span className="font-semibold">Category:</span>{" "}
            <Link href={`/category/${service.shop.categories}`}>
              {service.shop.categories}
            </Link>
          </p>
          <p className="text-base mt-3 flex gap-2 items-center">
            <MapPinPlus
              strokeWidth={1.25}
              className="w-6 h-6 text-2xl text-primary"
            />{" "}
            Location: {service.shop.address.street || ""} {" "} { service.shop.address.city || ""}  {" - "} { service.shop.address.postalCode || ""} 
          </p>
          <p className="text-base flex gap-2 items-center mt-3">
            <Clock
              strokeWidth={1.25}
              className="w-6 h-6 text-2xl text-primary"
            />{" "}
            Working Hour: {service.shop.workingHours.open || ""} {" - "} {service.shop.workingHours.close || ""}
          </p>
          <p className="text-base flex gap-2 items-center mt-3">
            <CalendarHeart
              strokeWidth={1.25}
              className="w-6 h-6 text-2xl text-primary"
            />{" "}
            Weekend: {service.shop.workingHours.weekend}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-2 border-t border-primary p-3 w-full mt-auto">
          <a
            href={`tel:${service.shop.contact.phone}`}
            className="w-1/2  py-3 bg-primary  hover:bg-white hover:border hover:border-primary  text-white hover:text-primary font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer text-center "
          >
            Contact
          </a>
          <Link
            className="w-1/2 py-3 border hover:border border-primary hover-border-primary hover:bg-accent text-primary font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer text-center"
            href={`/services/${service._id}`}
          >
            Service Details
          </Link>
        </div>
      </div>
    </div>
  );
}

import {CalendarHeart, Clock, MapPinPlus, Star} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ServiceCard({service}) {
  return (
    <div>
      <div
        key={service.id}
        className="border border-gray-300 rounded-xl overflow-hidden shadow-md h-full flex flex-col group"
      >
        {/* service Image */}
        <div className="h-60 w-full overflow-hidden relative">
          <Image
            fill
            src={service.image}
            className="object-cover group-hover:scale-120 duration-500 object-top"
            alt={service.name}
          />
        </div>

        {/* service Info */}
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">{service.name}</h2>
            <p className="w-14 shrink-0 text-right flex items-center gap-2">
              <Star strokeWidth={1.25} className="w-6 text-primary" />{" "}
              {service.rating}/5
            </p>
          </div>
          <p className="text-lg mt-3">
            <span className="font-semibold">Category:</span>{" "}
            <Link href={`/category/${service.category}`}>
              {service.category}
            </Link>
          </p>
          <p className="text-base mt-3 flex gap-2 items-center">
            <MapPinPlus
              strokeWidth={1.25}
              className="w-6 h-6 text-2xl text-primary"
            />{" "}
            Location: {service.location}
          </p>
          <p className="text-base flex gap-2 items-center mt-3">
            <Clock
              strokeWidth={1.25}
              className="w-6 h-6 text-2xl text-primary"
            />{" "}
            Working Hour: {service.workingHour}
          </p>
          <p className="text-base flex gap-2 items-center mt-3">
            <CalendarHeart
              strokeWidth={1.25}
              className="w-6 h-6 text-2xl text-primary"
            />{" "}
            Weekend: {service.weekend}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-2 border-t border-gray-100 p-3 w-full mt-auto">
          <Link
            href={`/services/${service.id}`}
            className="w-1/2  py-3 bg-primary  hover:bg-white hover:border hover:border-primary  text-white hover:text-primary font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer text-center "
          >
            Contact
          </Link>
          <Link
            className="w-1/2 py-3 border hover:border border-primary hover-border-primary hover:bg-accent text-primary font-bold text-xl capitalize leading-none font-urbanist rounded-md transition duration-400 cursor-pointer text-center"
            href={`/services/${service.id}`}
          >
            Service Details
          </Link>
        </div>
      </div>
    </div>
  );
}

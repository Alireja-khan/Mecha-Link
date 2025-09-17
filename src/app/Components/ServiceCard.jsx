import React from "react";

export default function ServiceCard({ service }) {
  return (
    <div>
      <div
        key={service.id}
        className="border border-gray-300 rounded-xl overflow-hidden shadow-md"
      >
        {/* service Image */}
        <div className="h-48 w-full">
          <img
            src={service.image}
            alt={service.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* service Info */}
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold">{service.name}</h2>
            <p className="w-8 shrink-0 text-right">{service.rating}/5</p>
          </div>
          <p className="text-sm text-gray-600">Category: {service.category}</p>
          <p className="text-sm text-gray-600">Location: {service.location}</p>
          <p className="text-sm text-gray-600">
            Working Hour: {service.workingHour}
          </p>
          <p className="text-sm text-gray-600">Weekend: {service.weekend}</p>

        </div>

        {/* Buttons */}
        <div className="flex justify-between border-t border-gray-300 p-3">
          <button className="w-1/2 mr-2 py-2 border border-gray-300 text-primary rounded-md transition">
            Contact
          </button>
          <button className="w-1/2 py-2 border border-gray-300 text-primary rounded-md transition">
            service Details
          </button>
        </div>
      </div>
    </div>
  );
}

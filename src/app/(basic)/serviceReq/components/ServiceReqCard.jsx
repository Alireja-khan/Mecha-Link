"use client";

import React from "react";
import { Phone, MapPin, Wrench, CalendarClock, Clock, CheckCircle } from "lucide-react";

const ServiceReqCard = () => {
    const request = {
        requestId: "SRV10001",
        userId: "USR001",
        phoneNumber: "+8801763767757",
        deviceType: "Truck",
        serviceDetails: {
            problemTitle: "Fuel pump issue",
            description: "Truck has issue: fuel pump issue.",
            images: [
                "https://i.ibb.co.com/qFdGVx3b/semi-truck.jpg",
                "https://i.ibb.co.com/hJxnKhrP/truck-carrying.jpg",
            ],
        },
        location: {
            address: "Rangpur City, Rangpur",
            latitude: 25.7466,
            longitude: 89.2517,
        },
        requestedDate: "2025-09-23T17:00:00Z",
        scheduledDate: "2025-09-24T17:00:00Z",
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold ">
                    Service Request: <span className="text-orange-500">{request.requestId}</span>
                </h2>
                <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${request.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                >
                    {request.status}
                </span>
            </div>

            {/* Device & User Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3">
                    <Wrench className="text-orange-500" />
                    <p className="text-gray-700 ">
                        <span className="font-semibold">Device:</span> {request.deviceType}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="text-orange-500" />
                    <p className="text-gray-700 ">
                        <span className="font-semibold">Phone:</span> {request.phoneNumber}
                    </p>
                </div>
            </div>

            {/* Problem Details */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    Problem Details
                </h3>
                <p className=" mb-2">
                    <span className="font-semibold">Title:</span> {request.serviceDetails.problemTitle}
                </p>
                <p className=" mb-4">
                    {request.serviceDetails.description}
                </p>

                {/* Images */}
                <div className="grid grid-cols-2 gap-3">
                    {request.serviceDetails.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt="service problem"
                            className="rounded-xl object-cover h-40 w-full shadow"
                        />
                    ))}
                </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 mb-6">
                <MapPin className="text-orange-500 mt-1" />
                <p className="text-gray-700 ">
                    <span className="font-semibold">Location:</span> {request.location.address}
                    <br />
                    <span className="text-sm text-gray-500">
                        (Lat: {request.location.latitude}, Lng: {request.location.longitude})
                    </span>
                </p>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                    <CalendarClock className="text-orange-500" />
                    <p className="text-gray-700 ">
                        <span className="font-semibold">Requested:</span>{" "}
                        {new Date(request.requestedDate).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="text-orange-500" />
                    <p className="text-gray-700 ">
                        <span className="font-semibold">Scheduled:</span>{" "}
                        {new Date(request.scheduledDate).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
                
            </div>
        </div>
    );
};

export default ServiceReqCard;

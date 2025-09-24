"use client";

import { useEffect, useState } from "react";
import ServiceReqCard from "./components/ServiceReqCard";

const ServiceReq = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/service-request"); // fetch all requests
        const data = await res.json();
        if (data.success) {
          setRequests(data.data); // save to state
        }
      } catch (error) {
        console.error("❌ Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {requests.map((req) => (
        <ServiceReqCard key={req._id} request={req} />
      ))}
    </div>
  );
};

export default ServiceReq;

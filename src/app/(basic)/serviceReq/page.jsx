"use client";

import { useEffect, useState } from "react";
import ServiceReqCard from "./components/ServiceReqCard";

const ServiceReq = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/service-request"); // ✅ fixed URL
        const data = await res.json();
        if (data.success) {
          setRequests(data.data);
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
        <ServiceReqCard key={req._id} request={req} mode="summary" />
      ))}
    </div>
  );
};

export default ServiceReq;

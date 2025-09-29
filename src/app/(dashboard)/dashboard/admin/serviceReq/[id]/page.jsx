"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RequestDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/service-request/${id}`);
        const data = await res.json();
        setRequest(data);
      } catch (err) {
        console.error("Failed to fetch request:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/service-request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (res.ok) {
        alert("Request updated successfully!");
        router.push("/manage-service-requests");
      } else {
        alert("Failed to update request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading request details...</p>;
  if (!request) return <p>Request not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Service Request</h1>
      
      <div className="grid gap-4">
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Device Type</span>
          <input
            type="text"
            name="deviceType"
            value={request.deviceType || ""}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
        </label>
        
        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Problem Category</span>
          <input
            type="text"
            name="problemCategory"
            value={request.problemCategory || ""}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Shop Name</span>
          <input
            type="text"
            name="shopName"
            value={request.shopName || ""}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-gray-700 font-medium">Status</span>
          <select
            name="status"
            value={request.status || "pending"}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Save Changes
        </button>
        <button
          onClick={() => router.push("/manage-service-requests")}
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

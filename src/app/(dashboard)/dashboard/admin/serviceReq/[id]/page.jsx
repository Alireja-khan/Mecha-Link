"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());

        console.log(formObject);

        try {
            const res = await fetch(`/api/dashboard/requests/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formObject),
            });

            if (res.ok) {
                await Swal.fire({
                    title: 'Success!',
                    text: 'Request updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay',
                });
                router.push("/dashboard/admin/serviceReq");
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

            <form onSubmit={handleSubmit} className="grid gap-4">
                {/* Device Type */}
                <label className="flex flex-col">
                    <span className="text-gray-700 font-medium">Device Type</span>
                    <input
                        type="text"
                        name="deviceType"
                        value={request.deviceType || ""}
                        onChange={handleChange}
                        className="p-3 border rounded-lg"
                        required
                    />
                </label>

                {/* Problem Category */}
                <label className="flex flex-col">
                    <span className="text-gray-700 font-medium">Problem Category</span>
                    <input
                        type="text"
                        name="problemCategory"
                        value={request.problemCategory || ""}
                        onChange={handleChange}
                        className="p-3 border rounded-lg"
                        required
                    />
                </label>

                {/* Status */}
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

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/manage-service-requests")}
                        className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

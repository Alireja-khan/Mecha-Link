"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Plus, Edit, Trash, X, Check } from "lucide-react";

const ManageAnnouncements = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: "", message: "" });

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  if (!loggedInUser || loggedInUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-gray-600">
        <p>Access denied. Admins only.</p>
      </div>
    );
  }

  const handleActivate = async (id) => {
    await fetch(`/api/announcements/${id}/activate`, { method: "PATCH" });
    fetchAnnouncements();
  };

  const handleDeactivate = async (id) => {
    await fetch(`/api/announcements/${id}/deactivate`, { method: "PATCH" });
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      fetchAnnouncements();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    if (editingAnnouncement) {
      // Edit
      await fetch(`/api/announcements/${editingAnnouncement._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      // Create
      await fetch(`/api/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "active" }),
      });
    }
    setModalOpen(false);
    setEditingAnnouncement(null);
    setFormData({ title: "", message: "" });
    fetchAnnouncements();
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({ title: announcement.title, message: announcement.message });
    setModalOpen(true);
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "active":
        return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-red-100 text-red-800`}>Inactive</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Manage Announcements</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
        >
          <Plus size={16} /> Add New Announcement
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by title or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-200 rounded-lg w-80"
        />
      </div>

      {/* Announcements Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading announcements...
                </td>
              </tr>
            ) : filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((ann) => (
                <tr key={ann._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{ann.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{ann.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(ann.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                    {ann.status !== "active" && (
                      <button
                        onClick={() => handleActivate(ann._id)}
                        className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {ann.status === "active" && (
                      <button
                        onClick={() => handleDeactivate(ann._id)}
                        className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(ann)}
                      className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No announcements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
              </h2>
              <button onClick={() => { setModalOpen(false); setEditingAnnouncement(null); setFormData({ title: "", message: "" }); }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setEditingAnnouncement(null); setFormData({ title: "", message: "" }); }}
                  className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                  {editingAnnouncement ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;

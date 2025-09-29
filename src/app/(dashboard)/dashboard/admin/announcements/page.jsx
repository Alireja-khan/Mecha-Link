"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Plus, Edit, Trash, X, Check, Search, Filter, Download, Megaphone, Calendar, Users, Bell } from "lucide-react";

const ManageAnnouncements = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: "", message: "" });

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

  if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
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
      await fetch(`/api/announcements/${editingAnnouncement._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
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
    const base = "px-3 py-1 text-xs font-semibold rounded-full border";
    switch (status) {
      case "active":
        return <span className={`${base} bg-green-100 text-green-700 border-green-200`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-red-100 text-red-700 border-red-200`}>Inactive</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700 border-gray-200`}>Unknown</span>;
    }
  };

  // Stats for the header
  const stats = {
    total: announcements.length,
    active: announcements.filter(ann => ann.status === "active").length,
    inactive: announcements.filter(ann => ann.status === "inactive").length,
    recent: announcements.filter(ann => new Date(ann.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
  };

  const StatCard = ({ icon: Icon, value, label, color = "orange" }) => (
    <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors duration-300`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
    </div>
  );

  

  return (
    <div className="min-h-screen p-6 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcement Management</h1>
          <p className="text-gray-600 text-lg">Manage platform announcements and notifications</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl mt-4 lg:mt-0"
        >
          <Plus size={20} />
          <span>Add New Announcement</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Megaphone} value={stats.total} label="Total Announcements" color="orange" />
        <StatCard icon={Bell} value={stats.active} label="Active Announcements" color="green" />
        <StatCard icon={X} value={stats.inactive} label="Inactive Announcements" color="red" />
        <StatCard icon={Calendar} value={stats.recent} label="Recent (7 days)" color="blue" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl">
        {/* Header with Search and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Announcements</h2>
            <p className="text-gray-600">Manage announcement status and content</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 w-full lg:w-80"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                <Filter size={16} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Announcements Table */}
        <div className="rounded-2xl border border-orange-100 overflow-hidden">
          <table className="min-w-full divide-y divide-orange-100">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Announcement Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Message Preview
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-orange-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex justify-center">
                      <span className="loading loading-bars loading-lg text-orange-500"></span>
                    </div>
                    <p className="text-gray-500 mt-2">Loading announcements...</p>
                  </td>
                </tr>
              ) : filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((ann) => (
                  <tr key={ann._id} className="hover:bg-orange-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          <Megaphone size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ann.title}</p>
                          <p className="text-sm text-gray-500">Announcement</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {ann.message}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        <span className="text-sm text-gray-700">
                          {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ann.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {ann.status !== "active" && (
                          <button
                            onClick={() => handleActivate(ann._id)}
                            className="p-2 bg-green-500/10 text-green-600 rounded-xl border border-green-200 hover:bg-green-500/20 hover:scale-105 transition-all duration-200"
                            title="Activate"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {ann.status === "active" && (
                          <button
                            onClick={() => handleDeactivate(ann._id)}
                            className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                            title="Deactivate"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(ann)}
                          className="p-2 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-500/20 hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(ann._id)}
                          className="p-2 bg-red-500/10 text-red-600 rounded-xl border border-red-200 hover:bg-red-500/20 hover:scale-105 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Megaphone className="text-gray-300" size={48} />
                      <p className="text-gray-500 text-lg">No announcements found</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Try adjusting your search terms" : "No announcements created yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
              </h2>
              <button
                onClick={() => { setModalOpen(false); setEditingAnnouncement(null); setFormData({ title: "", message: "" }); }}
                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-3">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300"
                  placeholder="Enter announcement title..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-3">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 resize-none"
                  rows={6}
                  placeholder="Enter announcement message..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setEditingAnnouncement(null); setFormData({ title: "", message: "" }); }}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
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
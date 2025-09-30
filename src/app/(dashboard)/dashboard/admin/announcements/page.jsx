"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Plus, Edit, Trash, X, Check, Search, Filter, Download, Megaphone, Calendar, Users, Bell, Eye } from "lucide-react";
import Swal from 'sweetalert2';

const ManageAnnouncements = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'OK',
      background: '#fff',
      color: '#1f2937',
      iconColor: '#22c55e'
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'OK',
      background: '#fff',
      color: '#1f2937',
      iconColor: '#ef4444'
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      background: '#fff',
      color: '#1f2937',
      iconColor: '#eab308',
      reverseButtons: true
    });
  };

  const showLoadingAlert = (title, text) => {
    Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#fff',
      color: '#1f2937'
    });
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      showErrorAlert('Error', 'Failed to load announcements');
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
    try {
      showLoadingAlert('Activating...', 'Please wait while we activate the announcement');
      
      const response = await fetch(`/api/announcements/${id}/activate`, { method: "PATCH" });
      if (!response.ok) throw new Error('Failed to activate');
      
      Swal.close();
      await fetchAnnouncements();
      showSuccessAlert('Activated!', 'The announcement has been activated successfully');
    } catch (error) {
      console.error('Activation failed:', error);
      Swal.close();
      showErrorAlert('Error', 'Failed to activate announcement');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      showLoadingAlert('Deactivating...', 'Please wait while we deactivate the announcement');
      
      const response = await fetch(`/api/announcements/${id}/deactivate`, { method: "PATCH" });
      if (!response.ok) throw new Error('Failed to deactivate');
      
      Swal.close();
      await fetchAnnouncements();
      showSuccessAlert('Deactivated!', 'The announcement has been deactivated successfully');
    } catch (error) {
      console.error('Deactivation failed:', error);
      Swal.close();
      showErrorAlert('Error', 'Failed to deactivate announcement');
    }
  };

  const handleDelete = async (id) => {
    const announcement = announcements.find(ann => ann._id === id);
    const result = await showConfirmDialog(
      'Are you sure?',
      `You are about to delete the announcement "${announcement?.title}". This action cannot be undone.`,
      'Yes, delete it!'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deleting...', 'Please wait while we delete the announcement');
        
        const response = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error('Failed to delete');
        
        Swal.close();
        await fetchAnnouncements();
        showSuccessAlert('Deleted!', 'The announcement has been deleted successfully');
      } catch (error) {
        console.error('Deletion failed:', error);
        Swal.close();
        showErrorAlert('Error', 'Failed to delete announcement');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      showErrorAlert('Validation Error', 'Please fill in both title and message fields');
      return;
    }

    try {
      showLoadingAlert(
        editingAnnouncement ? 'Updating...' : 'Creating...',
        editingAnnouncement ? 'Please wait while we update the announcement' : 'Please wait while we create the announcement'
      );

      if (editingAnnouncement) {
        const response = await fetch(`/api/announcements/${editingAnnouncement._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update');
      } else {
        const response = await fetch(`/api/announcements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, status: "active" }),
        });
        if (!response.ok) throw new Error('Failed to create');
      }

      Swal.close();
      setModalOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: "", message: "" });
      await fetchAnnouncements();
      
      showSuccessAlert(
        editingAnnouncement ? 'Updated!' : 'Created!',
        editingAnnouncement ? 'Announcement has been updated successfully' : 'Announcement has been created successfully'
      );
    } catch (error) {
      console.error('Form submission failed:', error);
      Swal.close();
      showErrorAlert(
        'Error',
        editingAnnouncement ? 'Failed to update announcement' : 'Failed to create announcement'
      );
    }
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({ title: announcement.title, message: announcement.message });
    setModalOpen(true);
  };

  const openDetailModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailModalOpen(true);
  };

  const handleModalClose = () => {
    if (formData.title || formData.message) {
      showConfirmDialog(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to close?',
        'Yes, close'
      ).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(false);
          setEditingAnnouncement(null);
          setFormData({ title: "", message: "" });
        }
      });
    } else {
      setModalOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: "", message: "" });
    }
  };

  // Search only by title
  const filteredAnnouncements = announcements.filter(
    (a) => a.title?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const StatCard = ({ icon: Icon, value, label, color = "orange" }) => {
    const colorClasses = {
      orange: {
        bg: "bg-orange-500/10",
        bgHover: "group-hover:bg-orange-500/20",
        text: "text-orange-600"
      },
      green: {
        bg: "bg-green-500/10", 
        bgHover: "group-hover:bg-green-500/20",
        text: "text-green-600"
      },
      red: {
        bg: "bg-red-500/10",
        bgHover: "group-hover:bg-red-500/20", 
        text: "text-red-600"
      },
      blue: {
        bg: "bg-blue-500/10",
        bgHover: "group-hover:bg-blue-500/20",
        text: "text-blue-600"
      }
    };

    const classes = colorClasses[color] || colorClasses.orange;

    return (
      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
            <Icon className={classes.text} size={24} />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-orange-200 rounded-xl bg-orange-50/50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all duration-300 w-full lg:w-80"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => showSuccessAlert('Coming Soon!', 'Filter functionality will be implemented soon.')}
                className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <Filter size={16} />
                Filter
              </button>
              <button 
                onClick={() => showSuccessAlert('Coming Soon!', 'Export functionality will be implemented soon.')}
                className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
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
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {ann.message.length > 100 ? `${ann.message.substring(0, 100)}...` : ann.message}
                        </p>
                        {ann.message.length > 100 && (
                          <button
                            onClick={() => openDetailModal(ann)}
                            className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1 transition-colors duration-200"
                          >
                            <Eye size={14} />
                            See more...
                          </button>
                        )}
                      </div>
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

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center backdrop-blur-md justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
              </h2>
              <button
                onClick={handleModalClose}
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
                  onClick={handleModalClose}
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

      {/* Detail View Modal */}
      {detailModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl border border-orange-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Announcement Details</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedAnnouncement.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {getStatusBadge(selectedAnnouncement.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created: {formatDate(selectedAnnouncement.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Message Content</h4>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedAnnouncement.message}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2">Status Information</h5>
                  <p className="text-sm text-blue-700">
                    This announcement is currently <span className="font-semibold">{selectedAnnouncement.status}</span> and 
                    {selectedAnnouncement.status === 'active' ? ' is visible to all users.' : ' is not visible to users.'}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h5 className="font-semibold text-green-900 mb-2">Last Updated</h5>
                  <p className="text-sm text-green-700">
                    {selectedAnnouncement.updatedAt ? 
                      formatDate(selectedAnnouncement.updatedAt) : 
                      'No updates made yet'
                    }
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openEditModal(selectedAnnouncement);
                  }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Edit Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
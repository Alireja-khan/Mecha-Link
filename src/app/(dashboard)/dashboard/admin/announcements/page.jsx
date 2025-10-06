"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Plus, Edit, Trash, X, Check, Search, Filter, Download, Megaphone, Calendar, Users, Bell, Eye, MessageSquare } from "lucide-react";
import Swal from 'sweetalert2';

// --- Utility Components (Kept the same as they are fine) ---

const StatCard = ({ icon: Icon, value, label, color = "primary" }) => {
  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      bgHover: "group-hover:bg-primary/20",
      text: "text-primary"
    },
    success: {
      bg: "bg-success/10",
      bgHover: "group-hover:bg-success/20",
      text: "text-success"
    },
    error: {
      bg: "bg-error/10",
      bgHover: "group-hover:bg-error/20",
      text: "text-error"
    },
    info: {
      bg: "bg-info/10",
      bgHover: "group-hover:bg-info/20",
      text: "text-info"
    }
  };

  const mappedColor = {
    orange: 'primary',
    green: 'success',
    red: 'error',
    blue: 'info',
  }[color] || 'primary';

  const classes = colorClasses[mappedColor];

  return (
    <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
          <Icon className={classes.text} size={20} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
      <p className="text-base-content/70 text-xs sm:text-sm font-medium">{label}</p>
    </div>
  );
};

const getStatusBadge = (status) => {
  const base = "px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
  switch (status) {
    case "active":
      return <span className={`${base} bg-success/10 text-success border-success/30`}>Active</span>;
    case "inactive":
      return <span className={`${base} bg-error/10 text-error border-error/30`}>Inactive</span>;
    default:
      return <span className={`${base} bg-base-300/50 text-base-content/70 border-base-300`}>Unknown</span>;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// --- Main Component ---

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
  const [statusFilter, setStatusFilter] = useState("all");

  // --- Swal Utility Functions (Kept the same) ---

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'OK',
      background: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      iconColor: 'var(--color-success)'
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'OK',
      background: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      iconColor: 'var(--color-error)'
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: 'var(--color-neutral)',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      background: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      iconColor: 'var(--color-warning)',
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
      background: 'var(--color-base-100)',
      color: 'var(--color-base-content)'
    });
  };

  // --- API/Data Logic (Kept the same) ---

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

  const handleUpdateStatus = async (id, actionType) => {
    const action = actionType === 'activate' ? 'Activate' : 'Deactivate';
    try {
      showLoadingAlert(`${action}ing...`, `Please wait while we ${action.toLowerCase()} the announcement`);

      const response = await fetch(`/api/announcements/${id}/${actionType}`, { method: "PATCH" });
      if (!response.ok) throw new Error(`Failed to ${action.toLowerCase()}`);

      Swal.close();
      await fetchAnnouncements();
      showSuccessAlert(`${action}d!`, `The announcement has been ${action.toLowerCase()}d successfully`);
    } catch (error) {
      console.error(`${action} failed:`, error);
      Swal.close();
      showErrorAlert('Error', `Failed to ${action.toLowerCase()} announcement`);
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

      let response;
      if (editingAnnouncement) {
        response = await fetch(`/api/announcements/${editingAnnouncement._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update');
      } else {
        response = await fetch(`/api/announcements`, {
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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

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
    const hasChanges = editingAnnouncement
      ? (formData.title !== editingAnnouncement.title || formData.message !== editingAnnouncement.message)
      : (formData.title || formData.message);

    if (hasChanges) {
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

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: announcements.length,
    active: announcements.filter(ann => ann.status === "active").length,
    inactive: announcements.filter(ann => ann.status === "inactive").length,
    recent: announcements.filter(ann => new Date(ann.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
  };

  const AnnouncementActions = ({ ann }) => (
    <div className="flex justify-center gap-1 sm:gap-2">
      {ann.status !== "active" && (
        <button
          onClick={() => handleUpdateStatus(ann._id, "activate")}
          className="p-1 sm:p-2 bg-success/10 text-success rounded-lg sm:rounded-xl border border-success/30 hover:bg-success/20 hover:scale-105 transition-all duration-200"
          title="Activate"
        >
          <Check size={14} />
        </button>
      )}
      {ann.status === "active" && (
        <button
          onClick={() => handleUpdateStatus(ann._id, "deactivate")}
          className="p-1 sm:p-2 bg-error/10 text-error rounded-lg sm:rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
          title="Deactivate"
        >
          <X size={14} />
        </button>
      )}
      <button
        onClick={() => openEditModal(ann)}
        className="p-1 sm:p-2 bg-primary/10 text-primary rounded-lg sm:rounded-xl border border-primary/30 hover:bg-primary/20 hover:scale-105 transition-all duration-200"
        title="Edit"
      >
        <Edit size={14} />
      </button>
      <button
        onClick={() => handleDelete(ann._id)}
        className="p-1 sm:p-2 bg-error/10 text-error rounded-lg sm:rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
        title="Delete"
      >
        <Trash size={14} />
      </button>
    </div>
  );

  const AnnouncementMobileCard = ({ ann }) => (
    <div className="bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3 mb-3 border-b border-base-300 pb-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
          <Megaphone size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base-content line-clamp-1">{ann.title || 'No Title'}</p>
          <p className="text-xs text-base-content/70 line-clamp-1 flex items-center gap-1">
            <Calendar size={12} className="text-base-content/50" />
            {formatDateShort(ann.createdAt)}
          </p>
        </div>
        {getStatusBadge(ann.status)}
      </div>

      <p className="text-sm text-base-content/80 line-clamp-2 mb-3">{ann.message}</p>

      <div className="flex justify-between items-center flex-wrap gap-2 pt-2">
        <button
          onClick={() => openDetailModal(ann)}
          className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-1 transition-colors duration-200"
        >
          <Eye size={14} />
          View Details
        </button>
        <AnnouncementActions ann={ann} />
      </div>
    </div>
  );

  if (loading || userLoading) return (
    <div className="flex items-center justify-center min-h-screen w-full bg-base-200"> {/* Changed from base-100 to base-200 */}
      <span className="loading loading-bars loading-xl text-primary"></span>
    </div>
  );

  return (
    // FIX 1: Change main container background to bg-base-200
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">Announcement Management</h1>
          <p className="text-base-content/70 text-sm sm:text-base lg:text-lg">Manage platform announcements and notifications</p>
        </div>
        <button
          onClick={() => { setEditingAnnouncement(null); setFormData({ title: "", message: "" }); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 lg:py-4 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-[1.02] shadow-lg hover:shadow-xl mt-4 lg:mt-0 text-sm sm:text-base"
        >
          <Plus size={20} />
          <span>Add New Announcement</span>
        </button>
      </div>

      {/* Stats Overview */}
      {/* Note: StatCard's inner background was changed to bg-base-100 in the StatCard definition above for contrast */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard icon={Megaphone} value={stats.total} label="Total Announcements" color="orange" />
        <StatCard icon={Bell} value={stats.active} label="Active Announcements" color="green" />
        <StatCard icon={X} value={stats.inactive} label="Inactive Announcements" color="red" />
        <StatCard icon={Calendar} value={stats.recent} label="Recent (7 days)" color="blue" />
      </div>

      {/* Main Content */}
      {/* FIX 2: Change main content card background from bg-base-200 to bg-base-100 for contrast */}
      <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-base-300 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={18} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Changed bg-base-100/50 to bg-base-200 for better contrast on base-100 background
              className="pl-10 pr-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 w-full text-sm text-base-content focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            // Changed bg-base-100/50 to bg-base-200 for better contrast on base-100 background
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 text-sm text-base-content focus:outline-none w-full md:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => showSuccessAlert('Coming Soon!', 'Export functionality will be implemented soon.')}
            // Changed bg-base-100 to bg-base-200 for better contrast on base-100 background
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-base-200 text-primary rounded-xl border border-base-300 hover:bg-base-300/50 transition-colors duration-200 text-sm justify-center w-full md:w-auto"
            title="Export Data"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Mobile View - Announcement Cards */}
        {/* Note: AnnouncementMobileCard inner background is already bg-base-100, which works well */}
        <div className="block xl:hidden space-y-4">
          {filteredAnnouncements.length > 0 ? filteredAnnouncements.map(ann => <AnnouncementMobileCard key={ann._id} ann={ann} />) : <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-base-content/30" /><p className="text-base-content/70">No announcements found</p></div>}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden xl:block rounded-2xl border border-base-300 overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            {/* Table header background is bg-base-300/50, which is fine */}
            <thead className="bg-base-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content w-48">Announcement Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content">Message Preview</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content w-40">Created Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content w-32">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-base-content w-32">Actions</th>
              </tr>
            </thead>
            {/* Table body background is bg-base-100, which is fine on base-100 card */}
            <tbody className="bg-base-100 divide-y divide-base-300">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((ann) => (
                  <tr key={ann._id} className="hover:bg-base-300/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                          <Megaphone size={16} />
                        </div>
                        <div>
                          {/* Removed whitespace-nowrap and added line-clamp to title */}
                          <p className="font-semibold text-base-content text-sm max-w-[200px] truncate">{ann.title}</p>
                          <button
                            onClick={() => openDetailModal(ann)}
                            className="text-primary hover:text-secondary text-xs font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                          >
                            <Eye size={12} />
                            View message
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-base-content/80 max-w-[400px] truncate">{ann.message}</p>
                    </td>
                    <td className="px-6 py-4"> {/* Removed whitespace-nowrap */}
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary flex-shrink-0" />
                        <span className="text-sm text-base-content/80">
                          {formatDateShort(ann.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ann.status || "inactive")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <AnnouncementActions ann={ann} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Megaphone className="text-base-content/30" size={48} />
                      <p className="text-base-content/70 text-lg">No announcements found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal (No structural changes needed for responsiveness) */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 bg-base-300/50 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-base-content/90 font-medium mb-2 sm:mb-3 text-sm">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  // Changed input background to bg-base-200 for slight contrast in modal
                  className="w-full p-3 sm:p-4 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 text-sm text-base-content"
                  placeholder="Enter announcement title..."
                  required
                />
              </div>
              <div>
                <label className="block text-base-content/90 font-medium mb-2 sm:mb-3 text-sm">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  // Changed input background to bg-base-200 for slight contrast in modal
                  className="w-full p-3 sm:p-4 border border-base-300 rounded-xl bg-base-200 focus:bg-base-100 focus:border-primary/50 focus:outline-none transition-all duration-300 resize-none text-sm text-base-content"
                  rows={6}
                  placeholder="Enter announcement message..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  // Changed button background to bg-base-200 for better contrast on base-100 modal
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-content rounded-xl font-semibold border border-base-300 hover:bg-base-300 transition-all duration-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm"
                >
                  {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal (No structural changes needed for responsiveness) */}
      {detailModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-base-300 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">Announcement Details</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 bg-base-300/50 text-base-content rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl border border-primary/30">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content flex-shrink-0">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-base-content">{selectedAnnouncement.title}</h3>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-sm text-base-content/80">
                      {getStatusBadge(selectedAnnouncement.status)}
                    </span>
                    <span className="text-sm text-base-content/60 flex items-center gap-1">
                      <Calendar size={12} />
                      Created: {formatDate(selectedAnnouncement.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-lg font-semibold text-base-content mb-3">Message Content</h4>
                {/* Changed background from base-200 to base-300/50 for subtle contrast with base-100 modal */}
                <div className="p-4 bg-base-300/50 rounded-xl border border-base-300">
                  <p className="text-base-content/90 whitespace-pre-wrap leading-relaxed text-sm">
                    {selectedAnnouncement.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  // Changed button background to bg-base-200 for better contrast on base-100 modal
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-base-200 text-base-content rounded-xl font-semibold border border-base-300 hover:bg-base-300 transition-all duration-300 text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openEditModal(selectedAnnouncement);
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary shadow-lg text-sm"
                >
                  <Edit size={16} className="inline mr-2" />Edit Announcement
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
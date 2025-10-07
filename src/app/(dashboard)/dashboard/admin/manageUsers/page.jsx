"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Check, X, Edit, Search, Filter, Download, Users, UserCheck, Mail, Calendar, Shield, Eye, Trash, Plus, Ban, UserCog, Phone, MapPin, MessageSquare } from "lucide-react";
import Swal from 'sweetalert2';

// --- Utility Functions ---

// Utility function to format date for full display
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

// Utility function to format date for short display (mobile table)
const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// Stat Card Component (Responsive updates applied)
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
    info: { // Added info color for pending/shield icon
      bg: "bg-info/10",
      bgHover: "group-hover:bg-info/20",
      text: "text-info"
    }
  };

  const classes = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-base-content/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${classes.bg} ${classes.bgHover} transition-colors duration-300`}>
          <Icon className={classes.text} size={20} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-base-content mb-1">{value}</p>
      <p className="text-base-content/60 text-xs sm:text-sm font-medium">{label}</p>
    </div>
  );
};


// --- Main Component ---

const ManageUsers = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
    phone: "",
    location: "",
    id: "" // For updates
  });
  const [roleFilter, setRoleFilter] = useState("all"); // Added role filter state

  // SweetAlert2 Functions (color updates for DaisyUI theme)
  const swalOptions = {
    confirmButtonColor: 'var(--color-success)',
    background: 'var(--color-base-100,)',
    color: 'var(--color-base-content)',
    cancelButtonColor: 'var(--color-error)',
  };

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: message,
      icon: 'success',
      iconColor: 'var(--color-success)'
    });
  };

  const showErrorAlert = (title, message) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: message,
      icon: 'error',
      iconColor: 'var(--color-error)'
    });
  };

  const showConfirmDialog = (title, text, confirmButtonText = 'Yes, proceed') => {
    return Swal.fire({
      ...swalOptions,
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      iconColor: 'var(--color-warning)'
    });
  };

  const showLoadingAlert = (title, text) => {
    Swal.fire({
      ...swalOptions,
      title: title,
      text: text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // To get all user data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // API call placeholder remains
      const res = await fetch("/api/users/dashboardUser");
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      // Removed alert during initial load to prevent spam on minor errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Handlers ---

  const handleActivate = async (id) => {
    const result = await showConfirmDialog(
      'Activate User',
      'Are you sure you want to activate this user?',
      'Yes, Activate'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Activating...', 'Please wait while we activate the user');

        const response = await fetch(`/api/users/dashboardUser/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "active" }),
        });

        if (!response.ok) throw new Error('Failed to activate user');

        Swal.close();
        await fetchUsers();
        showSuccessAlert('Activated!', 'The user has been activated successfully');
      } catch (error) {
        console.error('Activation failed:', error);
        Swal.close();
        showErrorAlert('Error', 'Failed to activate user');
      }
    }
  };

  // Deactivate function
  const handleDeactivate = async (id) => {
    const result = await showConfirmDialog(
      'Deactivate User',
      'Are you sure you want to deactivate this user?',
      'Yes, Deactivate'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deactivating...', 'Please wait while we deactivate the user');

        const response = await fetch(`/api/users/dashboardUser/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "inactive" }),
        });

        if (!response.ok) throw new Error('Failed to deactivate user');

        Swal.close();
        await fetchUsers();
        showSuccessAlert('Deactivated!', 'The user has been deactivated successfully');
      } catch (error) {
        console.error('Deactivation failed:', error);
        Swal.close();
        showErrorAlert('Error', 'Failed to deactivate user');
      }
    }
  };

  const handleDelete = async (id) => {
    const user = users.find(u => u._id === id);
    const result = await showConfirmDialog(
      'Delete User',
      `You are about to delete the user "${user?.name}". This action cannot be undone.`,
      'Yes, delete it!'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert('Deleting...', 'Please wait while we delete the user');

        const response = await fetch(`/api/users/dashboardUser/${id}`, {
          method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to delete user');
        }

        Swal.close();
        await fetchUsers();
        setDetailModalOpen(false); // Close detail modal if open
        showSuccessAlert('Deleted!', 'The user has been deleted successfully');
      } catch (error) {
        console.error('Deletion failed:', error);
        Swal.close();
        showErrorAlert('Error', error.message || 'Failed to delete user');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // For simplicity, we'll use the current state as the payload
    const { id, ...payload } = formData;

    // Determine if it's an add or edit operation
    const isEdit = !!id;

    const result = await showConfirmDialog(
      isEdit ? 'Update User' : 'Create User',
      isEdit ? `You are about to update the user "${payload.name}".` : `You are about to create the user "${payload.name}".`,
      isEdit ? 'Yes, Update it!' : 'Yes, Create it!'
    );

    if (result.isConfirmed) {
      try {
        showLoadingAlert(isEdit ? 'Updating...' : 'Creating...', 'Please wait...');

        const url = isEdit ? `/api/users/dashboardUser/${id}` : "/api/users/dashboardUser";
        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
          }
          throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} user data`);
        }

        Swal.close();
        await fetchUsers();
        showSuccessAlert(isEdit ? 'Updated!' : 'Created!', `The user data has been ${isEdit ? 'updated' : 'created'} successfully`);
        handleModalClose();
      } catch (error) {
        console.error('Operation failed:', error);
        Swal.close();
        showErrorAlert('Error', error.message || `Failed to ${isEdit ? 'update' : 'create'} user data`);
      }
    }
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "customer",
      status: user.status || "active",
      phone: user.phone || "",
      location: user.location || "",
      id: user._id
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setDetailModalOpen(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", role: "customer", status: "active", phone: "", location: "", id: "" });
  };

  // --- Data Filtering ---
  const filteredUsers = users.filter(
    (u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    }
  );
  // ----------------------

  // --- Badge Functions ---
  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
    switch (status) {
      case "active":
        return <span className={`${base} bg-success/10 text-success border-success/30`}>Active</span>;
      case "inactive":
        return <span className={`${base} bg-error/10 text-error border-error/30`}>Inactive</span>;
      case "pending":
        // Using info/20 for visibility and Shield icon in stats
        return <span className={`${base} bg-info/10 text-info border-info/30`}>Pending</span>;
      default:
        return <span className={`${base} bg-base-300 text-base-content/70 border-base-300`}>Unknown</span>;
    }
  };

  const getRoleBadge = (role) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-lg border capitalize whitespace-nowrap";
    switch (role) {
      case 'admin':
        // Custom color: Using secondary (purple/pink) for admin role
        return <span className={`${base} bg-secondary/10 text-secondary border-secondary/30`}>{role}</span>;
      case 'mechanic':
        // Custom color: Info (blue) for mechanic
        return <span className={`${base} bg-info/10 text-info border-info/30`}>{role}</span>;
      default: // customer
        // Primary (main orange) for customer
        return <span className={`${base} bg-primary/10 text-primary border-base-content/30`}>{role}</span>;
    }
  };

  // Stats for the header
  const stats = {
    total: users.length,
    active: users.filter(user => user.status === "active").length,
    pending: users.filter(user => user.status === "pending").length,
    inactive: users.filter(user => user.status === "inactive").length,
  };

  // --- Mobile User Card Component ---
  const UserMobileCard = ({ user }) => (
    <div className="bg-base-100 p-4 rounded-xl border border-base-content/20 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3 mb-3 border-b border-base-300 pb-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
          {user.name?.charAt(0) || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base-content truncate">{user.name || 'Unknown User'}</p>
          <p className="text-xs text-base-content/70 truncate flex items-center gap-1"><Mail size={12} className="text-base-content/40" />{user.email || 'N/A'}</p>
          <p className="text-xs text-base-content/70 truncate flex items-center gap-1"><MapPin size={12} className="text-base-content/40" />{user.location || 'Location N/A'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {getRoleBadge(user.role)}
          {getStatusBadge(user.status)}
        </div>
        <div className="flex gap-1.5">
          {/* Conditional Status Buttons */}
          {(user.status === "pending" || user.status === "inactive") && (
            <button
              onClick={() => handleActivate(user._id)}
              className="p-1.5 bg-success/10 text-success rounded-lg border border-success/30 hover:bg-success/20 transition-colors"
              title="Activate"
            >
              <Check size={16} />
            </button>
          )}
          {(user.status === "pending" || user.status === "active") && (
            <button
              onClick={() => handleDeactivate(user._id)}
              className="p-1.5 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
              title="Deactivate"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => openEditModal(user)}
            className="p-1.5 bg-primary/10 text-primary rounded-lg border border-base-content/30 hover:bg-primary/20 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => openDetailModal(user)}
            className="p-1.5 bg-info/10 text-info rounded-lg border border-info/30 hover:bg-info/20 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDelete(user._id)}
            className="p-1.5 bg-error/10 text-error rounded-lg border border-error/30 hover:bg-error/20 transition-colors"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
  // ------------------------------------

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-3 sm:p-4 lg:p-6 mx-auto bg-base-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-1 sm:mb-2">User Management</h1>
          <p className="text-base-content/60 text-sm sm:text-base lg:text-lg">Manage and monitor all platform users</p>
        </div>
        <button
          onClick={() => {
            handleModalClose(); // Ensures form is reset for new user
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-105 shadow-lg hover:shadow-xl mt-4 md:mt-0 text-sm sm:text-base"
        >
          <Plus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard icon={Users} value={stats.total} label="Total Users" color="primary" />
        <StatCard icon={UserCheck} value={stats.active} label="Active Users" color="success" />
        <StatCard icon={Shield} value={stats.pending} label="Pending Approval" color="info" />
        <StatCard icon={Ban} value={stats.inactive} label="Inactive Users" color="error" />
      </div>

      {/* Main Content */}
      <div className="bg-base-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-base-content/20 shadow-xl">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 w-full mb-6 items-center">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 sm:py-3 border border-base-content/30 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content w-full text-sm focus:outline-none text-base-content"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-base-content/30 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content text-sm focus:outline-none w-full md:w-auto text-base-content"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="mechanic">Mechanic</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={() => showSuccessAlert('Coming Soon!', 'Filter functionality will be implemented soon.')}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-base-200 text-primary rounded-xl border border-base-content/20 hover:bg-base-200/70 transition-colors duration-200 text-sm w-full md:w-auto"
          >
            <Filter size={16} />
            Filter
          </button>
          <button
            onClick={() => showSuccessAlert('Coming Soon!', 'Export functionality will be implemented soon.')}
            className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-base-200 text-primary rounded-xl border border-base-content/20 hover:bg-base-200/70 transition-colors duration-200 text-sm w-full md:w-auto"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Mobile User Cards (Visible on screens < xl) */}
        <div className="block xl:hidden space-y-4">
          {filteredUsers.length > 0 ? filteredUsers.map(u => <UserMobileCard key={u._id} user={u} />) : <div className="text-center py-12"><MessageSquare size={48} className="mx-auto text-base-content/30" /><p className="text-base-content/70">No users found</p></div>}
        </div>

        {/* Desktop Table (Visible on screens >= xl) */}
        <div className="hidden xl:block rounded-2xl border border-base-content/20 overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral">
            <thead className="bg-base-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-base-content uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-base-content uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-neutral">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex justify-center">
                      <span className="loading loading-bars loading-lg text-primary"></span>
                    </div>
                    <p className="text-base-content/70 mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-sm flex-shrink-0">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-base-content">{user.name || "N/A"}</p>
                          <button
                            onClick={() => openDetailModal(user)}
                            className="text-primary hover:text-secondary text-sm font-medium flex items-center gap-1 transition-colors duration-200 mt-1"
                          >
                            <Eye size={14} />
                            View details
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-primary" />
                          <span className="text-sm text-base-content/90">{user.email || "N/A"}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-primary" />
                            <span className="text-sm text-base-content/70">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role || "customer")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-sm text-base-content/90 whitespace-nowrap">
                          {formatDateShort(user.createdAt || Date.now())}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status || "active")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {(user.status === "pending" || user.status === "inactive") && (
                          <button
                            onClick={() => handleActivate(user._id)}
                            className="p-2 bg-success/10 text-success rounded-xl border border-success/30 hover:bg-success/20 hover:scale-105 transition-all duration-200"
                            title="Activate"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {(user.status === "pending" || user.status === "active") && (
                          <button
                            onClick={() => handleDeactivate(user._id)}
                            className="p-2 bg-error/10 text-error rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
                            title="Deactivate"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 bg-primary/10 text-primary rounded-xl border border-base-content/30 hover:bg-primary/20 hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDetailModal(user)}
                          className="p-2 bg-info/10 text-info rounded-xl border border-info/30 hover:bg-info/20 hover:scale-105 transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 bg-error/10 text-error rounded-xl border border-error/30 hover:bg-error/20 hover:scale-105 transition-all duration-200"
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
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="text-base-content/30" size={48} />
                      <p className="text-base-content/70 text-lg">No users found</p>
                      <p className="text-base-content/50 text-sm">
                        {searchTerm || roleFilter !== 'all' ? "Try adjusting your search or filters" : "No users registered yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal (Completed) */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-lg md:max-w-2xl border border-base-content/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                {selectedUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 bg-base-200 text-primary rounded-xl border border-base-content/20 hover:bg-base-200/70 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <input
                name="id"
                defaultValue={formData.id}
                type="text"
                hidden
                className="sr-only"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Input: Name */}
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 text-sm">Full Name *</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-base-content/20 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content focus:outline-none transition-all duration-300 text-sm text-base-content"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                {/* Input: Email */}
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 text-sm">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-base-content/20 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content focus:outline-none transition-all duration-300 text-sm text-base-content"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                {/* Select: Role */}
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 text-sm">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-3 border border-base-content/20 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content focus:outline-none transition-all duration-300 text-sm text-base-content"
                  >
                    <option value="customer">Customer</option>
                    <option value="mechanic">Mechanic</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {/* Select: Status */}
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 text-sm">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 border border-base-content/20 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content focus:outline-none transition-all duration-300 text-sm text-base-content"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                {/* Input: Phone - COMPLETE */}
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 text-sm">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-base-content/20 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content focus:outline-none transition-all duration-300 text-sm text-base-content"
                    placeholder="Enter phone number"
                  />
                </div>
                {/* Input: Location - COMPLETE */}
                <div>
                  <label className="block text-base-content/90 font-medium mb-2 text-sm">Location</label>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 border border-base-content/20 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-base-content focus:outline-none transition-all duration-300 text-sm text-base-content"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              {/* Form Actions - COMPLETE */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-3 bg-base-100 text-base-content/90 rounded-xl font-semibold border border-base-content/20 hover:bg-base-200 transition-all duration-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  {selectedUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* User Detail Modal (Completed) */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 p-4">
          <div className="bg-base-100 rounded-3xl p-6 sm:p-8 w-full max-w-lg md:max-w-2xl border border-base-content/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">User Details</h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 bg-base-200 text-primary rounded-xl border border-base-content/20 hover:bg-base-200/70 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-base-200/50 rounded-xl border border-base-content/20">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-lg flex-shrink-0">
                  {selectedUser.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-base-content">{selectedUser.name || "N/A"}</h3>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-sm text-base-content/90">
                      {getStatusBadge(selectedUser.status)}
                    </span>
                    <span className="text-sm text-base-content/70">
                      Joined: {formatDate(selectedUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Basic Information (Using info for general blue base-200) */}
                <div className="p-4 bg-info/10 rounded-xl border border-info/30">
                  <h5 className="font-semibold text-base-content/90 mb-2">Basic Information</h5>
                  <div className="space-y-2 text-sm text-base-content/80">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Role:</strong> {getRoleBadge(selectedUser.role)}</p>
                  </div>
                </div>

                {/* Contact Information (Using success for green base-200) */}
                <div className="p-4 bg-success/10 rounded-xl border border-success/30">
                  <h5 className="font-semibold text-base-content mb-2">Contact Information</h5>
                  <div className="space-y-2 text-base-content/90 text-sm">
                    <p className="flex items-center gap-2"><Phone size={14} className="text-success" />{selectedUser.phone || "Not provided"}</p>
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-success" />{selectedUser.location || "Not provided"}</p>
                  </div>
                </div>

                {/* Account Information (Using secondary/purple for base-200) */}
                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/30">
                  <h5 className="font-semibold text-base-content/90 mb-2">Account Information</h5>
                  <div className="space-y-2 text-base-content/80 text-sm">
                    <p><strong>Status:</strong> {getStatusBadge(selectedUser.status)}</p>
                    <p><strong>Created:</strong> {formatDate(selectedUser.createdAt)}</p>
                    {selectedUser.updatedAt && (
                      <p><strong>Last Updated:</strong> {formatDate(selectedUser.updatedAt)}</p>
                    )}
                  </div>
                </div>
                {/* Placeholder for future sections (e.g., related requests) */}
                <div className="p-4 bg-base-200/50 rounded-xl border border-base-content/20">
                  <h5 className="font-semibold text-base-content/90 mb-2">Related Data</h5>
                  <div className="space-y-2 text-base-content/80 text-sm">
                    <p>No related service requests found.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 flex-wrap">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-6 py-3 bg-base-100 text-base-content/90 rounded-xl font-semibold border border-base-content/20 hover:bg-base-200 transition-all duration-300 text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setDetailModalOpen(false);
                    openEditModal(selectedUser);
                  }}
                  className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold transition-all duration-300 hover:bg-secondary hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
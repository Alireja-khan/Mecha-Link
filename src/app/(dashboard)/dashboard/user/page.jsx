"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Car,
  Wrench,
  Star,
  Clock,
  MapPin,
  DollarSign,
  Shield,
  User,
  Settings,
  FileText,
  MessageSquare,
  Bell,
  Award,
  TrendingUp,
  Eye,
  UserCheck,
  Store
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import useUser from "@/hooks/useUser";
import Link from "next/link";

const UserDashboardOverview = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [summeryData, setSummeryData] = useState({});

  useEffect(() => {
    const fetchUserDashboardData = async () => {
      if (!loggedInUser) return;

      setLoading(true);
      try {
        const [serviceRes, reviewsRes, appointmentsRes] = await Promise.all([
          fetch(`/api/service-request/${loggedInUser._id}/status`),
          fetch(`/api/reviews?userId=${loggedInUser._id}`),
          fetch(`/api/reviews?userId=${loggedInUser._id}`),
          // fetch(`/api/appointments?userId=${loggedInUser._id}`)
        ]);

        const serviceData = await serviceRes.json();
        const reviewsData = await reviewsRes.json();
        const appointmentsData = await appointmentsRes.json();

        setServiceRequests(serviceData.result || serviceData || []);
        setReviews(reviewsData.result || reviewsData || []);
        setAppointments(appointmentsData.result || appointmentsData || []);

      } catch (err) {
        console.error("Failed to fetch user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDashboardData();
  }, [loggedInUser]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/summery?email=${loggedInUser?.email}`)
      .then(res => res.json())
      .then(data => {
        setSummeryData(data)
        setLoading(false);
      });
  }, [loggedInUser]);


  // Process service history for charts
  const processServiceHistory = () => {
    if (!serviceRequests || serviceRequests.length === 0) {
      return [
        { month: 'Jan', services: 0, spending: 0 },
        { month: 'Feb', services: 0, spending: 0 },
        { month: 'Mar', services: 0, spending: 0 },
        { month: 'Apr', services: 0, spending: 0 },
        { month: 'May', services: 0, spending: 0 },
        { month: 'Jun', services: 0, spending: 0 },
      ];
    }

    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        services: 0,
        spending: 0
      });
    }

    serviceRequests.forEach(request => {
      const requestDate = new Date(request.createdAt || request.requestedDate);
      const month = requestDate.toLocaleString('default', { month: 'short' });
      const monthData = last6Months.find(m => m.month === month);

      if (monthData) {
        monthData.services += 1;
        if (request.status === 'completed' || request.status === 'resolved') {
          monthData.spending += request.totalCost || request.estimatedCost || 0;
        }
      }
    });

    return last6Months;
  };

  // Process service type breakdown
  const processServiceTypeBreakdown = () => {
    if (!serviceRequests || serviceRequests.length === 0) {
      return [{ name: 'No Services', value: 1 }];
    }

    const serviceTypes = serviceRequests.reduce((acc, req) => {
      const type = req.serviceType || req.problemCategory || req.deviceType || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(serviceTypes).map(([name, value]) => ({
      name,
      value
    }));
  };



  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    return appointments
      .filter(apt => new Date(apt.appointmentDate) >= new Date())
      .slice(0, 3)
      .map(apt => ({
        id: apt._id,
        service: apt.serviceType || 'Scheduled Service',
        shop: apt.shopName || apt.shop?.shopName || 'AutoCare Shop',
        date: apt.appointmentDate,
        time: apt.appointmentTime || '10:00 AM',
        address: apt.shopAddress || '123 Main St, City'
      }));
  };

  // User Metrics Data - Matching Admin Dashboard Colors
  const userMetrics = [
    {
      id: 1,
      title: "Total Services",
      value: loading ? "…" : summeryData?.serviceStats?.total,
      icon: Wrench,
      color: "orange",
    },
    {
      id: 2,
      title: "Completed Services",
      value: loading ? "…" : summeryData?.serviceStats?.completed,
      icon: UserCheck,
      color: "green",
    },
    {
      id: 3,
      title: "Pending Services",
      value: loading ? "…" : summeryData?.serviceStats?.pending,
      icon: UserCheck,
      color: "emerald",
    },
    {
      id: 4,
      title: "Total Reviews",
      value: loading ? "…" : summeryData?.reviewStats?.totalReviews,
      icon: Star,
      color: "yellow",
    },
    {
      id: 5,
      title: "Avg. Rating",
      value: loading ? "…" : summeryData?.reviewStats?.averageRating,
      icon: Star,
      color: "yellow",
    },
    {
      id: 6,
      title: "Member Since",
      value: loading ? "…" : new Date(summeryData?.createdAt).getFullYear() || 2025,
      change: "Active user",
      trend: "up",
      icon: Calendar,
      color: "purple",
    },
  ];

  // Chart Colors - Matching Admin Dashboard
  const COLORS = ["#EA580C", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#9333EA"];

  // Color Mapping - Exact same as Admin Dashboard
  const colorMap = {
    orange: { bg: "bg-orange-500/15", hoverBg: "group-hover:bg-orange-500/25", text: "text-orange-500" },
    blue: { bg: "bg-blue-500/15", hoverBg: "group-hover:bg-blue-500/25", text: "text-blue-500" },
    green: { bg: "bg-green-500/15", hoverBg: "group-hover:bg-green-500/25", text: "text-green-500" },
    purple: { bg: "bg-purple-500/15", hoverBg: "group-hover:bg-purple-500/25", text: "text-purple-500" },
    emerald: { bg: "bg-emerald-500/15", hoverBg: "group-hover:bg-emerald-500/25", text: "text-emerald-500" },
    yellow: { bg: "bg-yellow-500/15", hoverBg: "group-hover:bg-yellow-500/25", text: "text-yellow-500" },
  };

  // Stat Card Component - Exact same as Admin Dashboard
  const StatCard = ({ icon: Icon, value, label, color = "orange" }) => {
    const { bg, hoverBg, text } = colorMap[color] || colorMap.orange;

    return (
      <div className="bg-base-100 rounded-3xl p-6 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bg} ${hoverBg} transition-colors duration-300`}>
            <Icon className={`${text}`} size={24} />
          </div>

        </div>
        <p className={`text-3xl font-bold ${text} mb-1`}>{value}</p>
        <p className="text-base-content/60 text-sm font-medium">{label}</p>
      </div>
    );
  };

  // Custom label for pie chart - Same as Admin Dashboard
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Loading and Auth Check - Same as Admin Dashboard
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-base-200">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-base-200">
        <span className="loading loading-bars loading-xl text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-base-200 space-y-8">
      {/* Header - Same gradient and style as Admin Dashboard */}
      <div className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-6 md:p-10 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">User Dashboard</h1>
            <p className="text-orange-100 text-sm sm:text-lg mt-2">
              Welcome back, <span className="font-semibold text-white">{loggedInUser.name}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <Calendar size={16} />
            <span>Joined {new Date(loggedInUser.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Same 6-column layout as Admin Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {userMetrics.map((metric) => (
          <StatCard
            key={metric.id}
            icon={metric.icon}
            value={metric.value}
            label={metric.title}
            change={metric.change}
            trend={metric.trend}
            color={metric.color}
          />
        ))}
      </div>

      {/* Charts - Same layout and styling as Admin Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Line Chart - Same styling */}
        <div className="xl:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">Service History Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processServiceHistory()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral)" />
              <XAxis dataKey="month" stroke="var(--color-base-content)" />
              <YAxis stroke="var(--color-base-content)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-base-100)', border: '1px solid var(--color-neutral)', borderRadius: '8px' }} />
              <Line
                type="monotone"
                dataKey="services"
                stroke="#EA580C"
                strokeWidth={3}
                dot={{ fill: '#EA580C', r: 4 }}
                name="Services"
              />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ fill: '#22C55E', r: 4 }}
                name="Spending ($)"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Same styling */}
        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">Service Type Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processServiceTypeBreakdown()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {processServiceTypeBreakdown().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-base-100)', border: '1px solid var(--color-neutral)', borderRadius: '8px' }} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity - Same layout as Admin Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Service Requests - Same styling */}
        <div className="bg-base-100 col-span-1 xl:col-span-2 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">My Recent Service Requests</h2>
            <Eye className="text-primary" size={24} />
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* Table Header */}
              <thead className="bg-base-200">
                <tr>
                  <th className="w-12 text-center">#</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Device Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <span className="loading loading-bars loading-md text-primary"></span>
                    </td>
                  </tr>
                ) : serviceRequests.length > 0 ? (
                  serviceRequests.map((service, index) => (
                    <tr key={service._id || index}>
                      <td>{index + 1}</td>
                      <td>{service?.serviceDetails?.problemTitle}</td>
                      <td>{service?.serviceDetails?.urgency}</td>
                      <td>{service?.deviceType}</td>
                      <td>{service.status}</td>
                      <td>
                        {/* Example actions */}
                        <Link href={`/serviceReq/${service._id}`} className="btn btn-sm btn-primary rounded-md">View</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No service requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments - Same styling as Recent Signups in Admin Dashboard */}
        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">Upcoming Appointments</h2>
            <Calendar className="text-primary" size={24} />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <span className="loading loading-bars loading-md text-primary"></span>
              </div>
            ) : getUpcomingAppointments().length > 0 ? (
              getUpcomingAppointments().map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {appointment.service?.charAt(0) || "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base-content truncate">{appointment.service}</p>
                    <p className="text-sm text-base-content/60 truncate">{appointment.shop}</p>
                    <p className="text-xs text-base-content/50">{appointment.time}</p>
                  </div>
                  <span className="text-xs text-base-content/50 whitespace-nowrap flex-shrink-0">
                    {new Date(appointment.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/70">No upcoming appointments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardOverview;
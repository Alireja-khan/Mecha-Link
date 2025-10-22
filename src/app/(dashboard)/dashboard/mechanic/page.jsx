"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Store,
  Wrench,
  UserCheck,
  DollarSign,
  Star,
  Shield,
  Crown,
  Calendar,
  Eye,
  FileText,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import useUser from "@/hooks/useUser";

const MechanicDashboardOverview = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!loggedInUser?._id) return;

      setLoading(true);
      try {
        console.log("Fetching dashboard data for user:", loggedInUser._id);
        console.log("User email:", loggedInUser.email);

        // ✅ FIXED: Fetch shop data using user email
        let shopData = null;
        try {
          const shopRes = await fetch(`/api/shops?email=${loggedInUser.email}`);
          console.log("Shop response status:", shopRes.status);

          if (shopRes.ok) {
            shopData = await shopRes.json();
            console.log("Raw shop data from API:", shopData);

            // ✅ Handle array response (your API returns array)
            if (Array.isArray(shopData) && shopData.length > 0) {
              shopData = shopData[0]; // Take the first shop
              console.log("First shop data:", shopData);
            } else if (Array.isArray(shopData) && shopData.length === 0) {
              console.log("No shops found for this user");
              shopData = null;
            } else {
              console.log("Unexpected shop data format:", typeof shopData);
            }
          } else {
            console.log("No shop found or error:", shopRes.status);
            const errorText = await shopRes.text();
            console.log("Error response:", errorText);
            shopData = null;
          }
        } catch (shopError) {
          console.error("Error fetching shop data:", shopError);
          shopData = null;
        }

        // ✅ Set shop data (could be null if no shop found)
        setShopData(shopData);

        console.log("Final shop data to be set:", shopData);

        // Get the actual shop ID from shop data
        const shopId = shopData?._id;
        console.log("Shop ID:", shopId);

        // Fetch service requests for this shop
        let requestsData = [];
        try {
          console.log(
            "Fetching service requests for shop ID:",
            loggedInUser._id
          );
          const requestsRes = await fetch(
            `/api/service-request/shop/${loggedInUser._id}`
          );
          console.log("Service requests response status:", requestsRes.status);

          if (requestsRes.ok) {
            requestsData = await requestsRes.json();
            console.log("Service requests data:", requestsData);
          } else {
            console.log(
              "No service requests found or error:",
              requestsRes.status
            );
            const errorText = await requestsRes.text();
            console.log("Error response:", errorText);
          }
        } catch (error) {
          console.error("Error fetching service requests:", error);
        }

        setAcceptedRequests(Array.isArray(requestsData) ? requestsData : []);

        // Fetch all reviews
        let allReviews = [];
        try {
          console.log("Fetching all reviews...");
          const reviewsRes = await fetch("/api/reviews");
          console.log("Reviews response status:", reviewsRes.status);

          if (reviewsRes.ok) {
            allReviews = await reviewsRes.json();
            console.log("All reviews data:", allReviews);
          } else {
            console.log("No reviews found or error:", reviewsRes.status);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }

        // Filter reviews by shop ID - FIXED: Use the actual shop ID from shop data
        console.log("Filtering reviews for shop ID:", shopId);
        const shopReviews = allReviews.filter((review) => {
          // Check if review belongs to this shop using shopId field
          const matchesShop = shopId && review.shopId === shopId.toString();
          // Also check if review belongs to user's shop via other possible fields
          const matchesUserShop = review.shopId === loggedInUser._id;
          const matchesService = review.serviceId === shopId;

          console.log(`Review ${review._id}:`, {
            reviewShopId: review.shopId,
            reviewServiceId: review.serviceId,
            shopId,
            userId: loggedInUser._id,
            matchesShop,
            matchesUserShop,
            matchesService,
          });

          return matchesShop || matchesUserShop || matchesService;
        });

        console.log("Shop reviews after filtering:", shopReviews);
        setRecentReviews(
          Array.isArray(shopReviews) ? shopReviews.slice(-5).reverse() : []
        );

        // Calculate performance stats
        const requestsArray = Array.isArray(requestsData) ? requestsData : [];
        const completedRequests = requestsArray.filter(
          (req) => req.status === "completed"
        ).length;
        const inProgressRequests = requestsArray.filter(
          (req) => req.status === "in-progress"
        ).length;
        const pendingRequests = requestsArray.filter(
          (req) =>
            req.status === "pending" || req.status === "accepted" || !req.status
        ).length;

        // Calculate total earnings from completed requests
        const totalEarnings = requestsArray
          .filter((req) => req.status === "completed")
          .reduce((sum, req) => {
            const cost =
              req.serviceDetails?.estimatedCost ||
              req.estimatedCost ||
              req.estimatedBudget?.split("-")[0]?.trim() ||
              req.cost ||
              0;
            const costValue = parseFloat(cost) || 0;
            console.log(`Request ${req._id} cost:`, cost, "parsed:", costValue);
            return sum + costValue;
          }, 0);

        // Calculate completion rate
        const totalRequests = requestsArray.length;
        const completionRate =
          totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;

        // Calculate average rating from reviews - FIXED: Use the filtered shop reviews
        const shopReviewsArray = Array.isArray(shopReviews) ? shopReviews : [];
        const totalRatings = shopReviewsArray.reduce((sum, review) => {
          const rating = parseFloat(review.rating) || 0;
          console.log(`Review ${review._id} rating:`, rating);
          return sum + rating;
        }, 0);
        const averageRating =
          shopReviewsArray.length > 0
            ? totalRatings / shopReviewsArray.length
            : 0;

        const stats = {
          completed: completedRequests,
          inProgress: inProgressRequests,
          pending: pendingRequests,
          totalEarnings,
          completionRate: completionRate.toFixed(1),
          averageRating: averageRating.toFixed(1),
          totalRequests,
          totalReviews: shopReviewsArray.length,
        };

        console.log("Final performance stats:", stats);
        setPerformanceStats(stats);

        // Generate revenue data for chart
        const monthlyRevenue = generateMonthlyRevenue(requestsArray);
        console.log("Revenue data:", monthlyRevenue);
        setRevenueData(monthlyRevenue);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Set default data on error
        setPerformanceStats({
          completed: 0,
          inProgress: 0,
          pending: 0,
          totalEarnings: 0,
          completionRate: 0,
          averageRating: 0,
          totalRequests: 0,
          totalReviews: 0,
        });
        setRevenueData(generateMonthlyRevenue([]));
        setShopData(null);
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchDashboardData();
    }
  }, [loggedInUser]);

  // Generate monthly revenue data from service requests
  const generateMonthlyRevenue = (requests) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // If no requests, return empty data for all months
    if (!requests || requests.length === 0) {
      return months.map((month) => ({ month, revenue: 0 }));
    }

    const revenueByMonth = {};

    requests
      .filter((req) => req.status === "completed")
      .forEach((req) => {
        const date =
          req.updatedAt || req.createdAt || req.requestedDate || new Date();
        const month = new Date(date).getMonth();
        const monthName = months[month];
        const cost =
          req.serviceDetails?.estimatedCost ||
          req.estimatedCost ||
          req.estimatedBudget?.split("-")[0]?.trim() ||
          req.cost ||
          0;
        revenueByMonth[monthName] =
          (revenueByMonth[monthName] || 0) + (parseFloat(cost) || 0);
      });

    return months.map((month) => ({
      month,
      revenue: revenueByMonth[month] || 0,
    }));
  };

  // Platform metrics for mechanic dashboard
  const mechanicMetrics = [
    {
      id: 1,
      title: "Completed Jobs",
      value: loading ? "…" : performanceStats.completed || 0,
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      id: 2,
      title: "In Progress",
      value: loading ? "…" : performanceStats.inProgress || 0,
      change: "+3",
      trend: "up",
      icon: Clock,
      color: "blue",
    },
    {
      id: 3,
      title: "Pending Requests",
      value: loading ? "…" : performanceStats.pending || 0,
      change: "-2",
      trend: "down",
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: loading
        ? "…"
        : `$${performanceStats.totalEarnings?.toLocaleString() || 0}`,
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "emerald",
    },
    {
      id: 5,
      title: "Completion Rate",
      value: loading ? "…" : `${performanceStats.completionRate || 0}%`,
      change: "+5%",
      trend: "up",
      icon: Star,
      color: "purple",
    },
    {
      id: 6,
      title: "Shop Rating",
      value: loading
        ? "…"
        : performanceStats.averageRating > 0
        ? performanceStats.averageRating
        : "0.0",
      change: "+0.3",
      trend: "up",
      icon: Star,
      color: "orange",
    },
  ];

  // Service type breakdown for assigned requests
  const serviceTypeBreakdown = acceptedRequests.reduce((acc, req) => {
    const type = req.deviceType || req.problemCategory || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const serviceTypeData = Object.entries(serviceTypeBreakdown).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Recent activity data
  const recentActivity = acceptedRequests
    .slice(-5)
    .reverse()
    .map((request) => ({
      id: request._id,
      customer:
        request.user?.name ||
        request.user?.userName ||
        request.userEmail ||
        "Unknown Customer",
      service:
        request.deviceType || request.problemCategory || "General Service",
      status: request.status || "pending",
      date: new Date(
        request.updatedAt ||
          request.createdAt ||
          request.requestedDate ||
          Date.now()
      ).toLocaleDateString(),
      urgency: request.serviceDetails?.urgency || "medium",
    }));

  // Status colors
  const statusColors = {
    completed: "bg-green-100 text-green-600",
    "in-progress": "bg-blue-100 text-blue-600",
    pending: "bg-yellow-100 text-yellow-600",
    accepted: "bg-purple-100 text-purple-600",
    cancelled: "bg-red-100 text-red-600",
  };

  // Urgency colors
  const urgencyColors = {
    emergency: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const colorMap = {
    orange: {
      bg: "bg-orange-500/15",
      hoverBg: "group-hover:bg-orange-500/25",
      text: "text-orange-500",
    },
    blue: {
      bg: "bg-blue-500/15",
      hoverBg: "group-hover:bg-blue-500/25",
      text: "text-blue-500",
    },
    green: {
      bg: "bg-green-500/15",
      hoverBg: "group-hover:bg-green-500/25",
      text: "text-green-500",
    },
    purple: {
      bg: "bg-purple-500/15",
      hoverBg: "group-hover:bg-purple-500/25",
      text: "text-purple-500",
    },
    emerald: {
      bg: "bg-emerald-500/15",
      hoverBg: "group-hover:bg-emerald-500/25",
      text: "text-emerald-500",
    },
    yellow: {
      bg: "bg-yellow-500/15",
      hoverBg: "group-hover:bg-yellow-500/25",
      text: "text-yellow-500",
    },
  };

  // Chart colors
  const COLORS = [
    "#EA580C",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#9333EA",
  ];

  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Stat Card Component
  const StatCard = ({
    icon: Icon,
    value,
    label,
    change,
    trend,
    color = "orange",
  }) => {
    const { bg, hoverBg, text } = colorMap[color] || colorMap.orange;

    return (
      <div className="bg-base-100 rounded-3xl p-6 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] group">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl ${bg} ${hoverBg} transition-colors duration-300`}
          >
            <Icon className={`${text}`} size={24} />
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold ${
              trend === "up"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {change}
          </span>
        </div>
        <p className={`text-3xl font-bold ${text} mb-1`}>{value}</p>
        <p className="text-base-content/60 text-sm font-medium">{label}</p>
      </div>
    );
  };

  // Loading and Auth Check
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
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-6 md:p-10 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Store size={32} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Mechanic Dashboard
              </h1>
              <p className="text-orange-100 text-sm sm:text-lg mt-2">
                Welcome back,{" "}
                <span className="font-semibold text-white">
                  {loggedInUser.name}
                </span>
              </p>
              <p className="text-orange-200 text-sm mt-1">
                {shopData?.shop?.shopName || "Your Shop"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
              <MapPin size={16} />
              <span className="text-sm">
                {shopData?.shop?.address?.city || "City"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
              <Phone size={16} />
              <span className="text-sm">
                {shopData?.shop?.contact?.phone || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
              <Star size={16} />
              <span className="text-sm">
                Rating: {performanceStats.averageRating || "0.0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {mechanicMetrics.map((metric) => (
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-neutral)"
              />
              <XAxis dataKey="month" stroke="var(--color-base-content)" />
              <YAxis stroke="var(--color-base-content)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-base-100)",
                  border: "1px solid var(--color-neutral)",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#EA580C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Type Breakdown */}
        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">
            Service Types
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={
                  serviceTypeData.length > 0
                    ? serviceTypeData
                    : [{ name: "No Data", value: 1 }]
                }
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {serviceTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                {serviceTypeData.length === 0 && (
                  <Cell key="cell-0" fill="#94a3b8" />
                )}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-base-100)",
                  border: "1px solid var(--color-neutral)",
                  borderRadius: "8px",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Reviews */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Service Requests */}
        <div className="xl:col-span-2 bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
              Recent Service Requests
            </h2>
            <Eye className="text-primary" size={24} />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <span className="loading loading-bars loading-md text-primary"></span>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        urgencyColors[activity.urgency] || "bg-gray-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base-content truncate">
                        {activity.customer}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {activity.service}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        statusColors[activity.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {activity.status.replace("-", " ")}
                    </span>
                    <span className="text-xs text-base-content/50 whitespace-nowrap">
                      {activity.date}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/70">
                No recent service requests
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-base-content">
              Recent Reviews
            </h2>
            <Star className="text-primary" size={24} />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <span className="loading loading-bars loading-md text-primary"></span>
              </div>
            ) : recentReviews.length > 0 ? (
              recentReviews.map((review, i) => (
                <div
                  key={i}
                  className="p-4 bg-base-200 rounded-xl border border-base-300 hover:bg-base-300 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {review.userName?.charAt(0) ||
                          review.customerName?.charAt(0) ||
                          "C"}
                      </div>
                      <p className="font-semibold text-base-content text-sm">
                        {review.userName || review.customerName || "Anonymous"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-base-content">
                        {review.rating || "0"}.0
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {review.feedback || review.comment || "No comment provided"}
                  </p>
                  <span className="text-xs text-base-content/50 mt-2 block">
                    {new Date(
                      review.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/70">
                No recent reviews
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]">
            <Wrench size={20} />
            <span>Manage Jobs</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]">
            <Settings size={20} className="text-primary" />
            <span>Shop Settings</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]">
            <BarChart3 size={20} className="text-primary" />
            <span>Performance</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]">
            <FileText size={20} />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Shop Information */}
      <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-6">
          Shop Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-base-content/70 text-sm">
              Shop Name
            </h3>
            <p className="text-base-content font-medium">
              {shopData?.shop?.shopName || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base-content/70 text-sm">
              Contact Email
            </h3>
            <p className="text-base-content font-medium">
              {shopData?.shop?.contact?.businessEmail || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base-content/70 text-sm">
              Phone
            </h3>
            <p className="text-base-content font-medium">
              {shopData?.shop?.contact?.phone || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base-content/70 text-sm">
              Status
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                shopData?.status === "approved"
                  ? "bg-green-100 text-green-600"
                  : shopData?.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {shopData?.status || "pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicDashboardOverview;

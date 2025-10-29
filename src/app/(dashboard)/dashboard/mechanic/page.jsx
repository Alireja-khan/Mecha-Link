"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Store,
  Wrench,
  DollarSign,
  Star,
  Eye,
  FileText,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Loader2,
  Radio,
  BrainCircuit,
} from "lucide-react";
import {
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
import Loader from "@/app/(basic)/loading";
import Link from "next/link";

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

const MechanicDashboardOverview = () => {
  const { user: loggedInUser, loading: userLoading } = useUser();

  const [shopLoading, setShopLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [shopData, setShopData] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [allReviews, setAllReviews] = useState([]);


  useEffect(() => {
    const fetchShopData = async () => {
      if (!loggedInUser?.email) return;

      setShopLoading(true);
      try {
        const shopRes = await fetch(`/api/shops?email=${loggedInUser.email}`);
        let data = null;

        if (shopRes.ok) {
          data = await shopRes.json();
          if (Array.isArray(data) && data.length > 0) {
            data = data[0];
          } else if (Array.isArray(data) && data.length === 0) {
            data = null;
          }
        } else {
          console.error("Shop fetch failed:", await shopRes.text());
        }

        setShopData(data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
        setShopData(null);
      } finally {
        setShopLoading(false);
      }
    };

    fetchShopData();
  }, [loggedInUser]);


  useEffect(() => {
    const fetchRequestsData = async () => {
      if (!loggedInUser?._id) return;

      setRequestsLoading(true);
      try {
        const requestsRes = await fetch(
          `/api/service-request/shop/${loggedInUser._id}`
        );
        let data = [];

        if (requestsRes.ok) {
          data = await requestsRes.json();
        } else {
          console.error("Requests fetch failed:", await requestsRes.text());
        }

        setAllRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching service requests:", error);
        setAllRequests([]);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequestsData();
  }, [loggedInUser]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const reviewsRes = await fetch("/api/reviews");
        let data = [];

        if (reviewsRes.ok) {
          data = await reviewsRes.json();
        } else {
          console.error("Reviews fetch failed:", await reviewsRes.text());
        }

        setAllReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setAllReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);


  const shopReviews = useMemo(() => {
    const shopId = shopData?._id;
    if (!shopId || allReviews.length === 0) return [];

    return allReviews.filter((review) => {
      const matchesShop = review.shopId === shopId.toString();
      const matchesUserShop = review.shopId === loggedInUser._id;
      const matchesService = review.serviceId === shopId;

      return matchesShop || matchesUserShop || matchesService;
    });
  }, [allReviews, shopData, loggedInUser?._id]);

  const performanceStats = useMemo(() => {
    const requestsArray = allRequests;
    const shopReviewsArray = shopReviews;

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
        return sum + costValue;
      }, 0);

    const totalRequests = requestsArray.length;
    const completionRate =
      totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;

    const totalRatings = shopReviewsArray.reduce((sum, review) => {
      const rating = parseFloat(review.rating) || 0;
      return sum + rating;
    }, 0);
    const averageRating =
      shopReviewsArray.length > 0 ? totalRatings / shopReviewsArray.length : 0;

    return {
      completed: completedRequests,
      inProgress: inProgressRequests,
      pending: pendingRequests,
      totalEarnings,
      completionRate: completionRate.toFixed(1),
      averageRating: averageRating.toFixed(1),
      totalRequests,
      totalReviews: shopReviewsArray.length,
    };
  }, [allRequests, shopReviews]);

  const revenueData = useMemo(() => {
    return generateMonthlyRevenue(allRequests);
  }, [allRequests]);

  // 🔥 CHANGE APPLIED HERE: Using allRequests for service breakdown and activity
  const allServiceRequests = useMemo(() => allRequests, [allRequests]);

  const recentReviews = useMemo(() => shopReviews.slice(-5).reverse(), [shopReviews]);

  // Dependent on allServiceRequests (which is now allRequests)
  const serviceTypeBreakdown = useMemo(() => allServiceRequests.reduce((acc, req) => {
    const type = req.deviceType || req.problemCategory || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}), [allServiceRequests]);

  const serviceTypeData = useMemo(() => Object.entries(serviceTypeBreakdown).map(
    ([name, value]) => ({
      name,
      value,
    })
  ), [serviceTypeBreakdown]);

  // Dependent on allServiceRequests (which is now allRequests)
  const recentActivity = useMemo(() => allServiceRequests
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
    })), [allServiceRequests]);

  const fullLoading = shopLoading || requestsLoading || reviewsLoading;


  const mechanicMetrics = [
    {
      id: 1,
      title: "Completed Jobs",
      value: fullLoading ? (<Loader2 className="animate-spin" />) : performanceStats.completed || 0,
      icon: CheckCircle,
      color: "green",
    },
    {
      id: 2,
      title: "In Progress",
      value: fullLoading ? (<Loader2 className="animate-spin" />) : performanceStats.inProgress || 0,
      icon: Clock,
      color: "blue",
    },
    {
      id: 3,
      title: "Pending Requests",
      value: fullLoading ? (<Loader2 className="animate-spin" />) : performanceStats.pending || 0,
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: fullLoading
        ? (<Loader2 className="animate-spin" />)
        : `$${performanceStats.totalEarnings?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "emerald",
    },
    {
      id: 5,
      title: "Completion Rate",
      value: fullLoading ? (<Loader2 className="animate-spin" />) : `${performanceStats.completionRate || 0}%`,
      icon: Star,
      color: "purple",
    },
    {
      id: 6,
      title: "Shop Rating",
      value: fullLoading
        ? (<Loader2 className="animate-spin" />)
        : performanceStats.averageRating > 0
          ? performanceStats.averageRating
          : "0.0",
      icon: Star,
      color: "orange",
    },
  ];

  const statusColors = {
    completed: "bg-success/20 text-success",
    "in-progress": "bg-info/20 text-info",
    pending: "bg-warning/20 text-warning",
    accepted: "bg-primary/20 text-primary",
    cancelled: "bg-error/20 text-error",
  };

  const urgencyColors = {
    emergency: "bg-error",
    high: "bg-primary",
    medium: "bg-warning",
    low: "bg-success",
  };

  const colorMap = {
    orange: {
      bg: "bg-primary/15",
      hoverBg: "group-hover:bg-primary/25",
      text: "text-primary",
    },
    blue: {
      bg: "bg-info/15",
      hoverBg: "group-hover:bg-info/25",
      text: "text-info",
    },
    green: {
      bg: "bg-success/15",
      hoverBg: "group-hover:bg-success/25",
      text: "text-success",
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
      bg: "bg-warning/15",
      hoverBg: "group-hover:bg-warning/25",
      text: "text-warning",
    },
  };

  const COLORS = [
    "#EA580C",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#9333EA",
  ];

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

  const StatCard = ({
    icon: Icon,
    value,
    label,
    change,
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
        </div>
        <p className={`text-3xl font-bold ${text} mb-1`}>{value}</p>
        <p className="text-base-content/60 text-sm font-medium">{label}</p>
      </div>
    );
  };

  if (userLoading || !loggedInUser) {
    return (
      <Loader />
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
              <Link href={`/services/${shopData?._id}`}>
                <button className="text-orange-200 text-sm mt-1 py-1 px-2 rounded-lg bg-secondary/50 cursor-pointer hover:scale-105 transition duration-300">
                  {shopData?.shop?.shopName || "Your Shop"}
                </button>
              </Link>
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
          {fullLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
          ) : (
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
          )}
        </div>

        {/* Service Type Breakdown */}
        <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-neutral shadow-xl transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-base-content mb-8">
            Service Types
          </h2>
          {fullLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
          ) : (
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
                  label={serviceTypeData.length > 0 ? renderCustomizedLabel : false}
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
          )}
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
            {fullLoading ? (
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
                      className={`w-3 h-3 rounded-full ${urgencyColors[activity.urgency] || "bg-gray-500"
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
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[activity.status] ||
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
            {fullLoading ? (
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
                No recent reviews for your shop
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
          <Link href={'mechanic/requests'}>
            <button className="flex items-center w-full justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]">
              <Wrench size={20} />
              <span>Manage requests</span>
            </button>
          </Link>
          <Link href={'mechanic/settings'}>
            <button className="flex w-full items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]">
              <Settings size={20} className="text-primary" />
              <span>Shop Settings</span>
            </button>
          </Link>
          <Link href={'mechanic/advertise'}>
            <button className="flex w-full items-center justify-center gap-2 p-4 bg-base-200 text-base-content rounded-xl text-xs md:text-sm font-semibold border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg transform hover:scale-[1.03]">
              <Radio size={20} className="text-primary" />
              <span>Advertise</span>
            </button>
          </Link>
          <Link href={'mechanic/AskAI'}>
            <button className="flex w-full items-center justify-center gap-2 p-4 bg-primary text-primary-content rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:bg-orange-700 hover:shadow-lg transform hover:scale-[1.03]">
              <BrainCircuit size={20} />
              <span>Ask AI</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MechanicDashboardOverview;
// app/admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiActivity,
} from "react-icons/fi";
import { fetchDashboardStats } from "@/services/analyticsService";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import DashboardMetricsGrid from "@/components/admin/analytics/DashboardMetricsGrid";
import RecentOrdersTable from "@/components/admin/analytics/RecentOrdersTable";
import PopularProductsChart from "@/components/admin/analytics/PopularProductsChart";
import OrderStatusChart from "@/components/admin/analytics/OrderStatusChart";
import type { MetricProps } from "@/components/admin/analytics/DashboardMetricsGrid";

const AdminAnalyticsDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
        setError("");
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader title="Analytics Dashboard" />
        <LoadingState />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader title="Analytics Dashboard" />
        <ErrorState
          message={error || "Failed to load analytics data"}
          buttonText="Try Again"
          onButtonClick={() => window.location.reload()}
        />
      </div>
    );
  }

  const metricsData: MetricProps[] = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: <FiDollarSign className="h-6 w-6 text-green-500" />,
      change: "+15%",
      changeType: "positive",
      link: "/admin/analytics/sales",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FiShoppingBag className="h-6 w-6 text-blue-500" />,
      change: "+8%",
      changeType: "positive",
      link: "/admin/orders",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FiUsers className="h-6 w-6 text-purple-500" />,
      change: "+12%",
      changeType: "positive",
      link: "/admin/analytics/users",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FiPackage className="h-6 w-6 text-orange-500" />,
      change: "+5%",
      changeType: "positive",
      link: "/admin/products",
    },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader title="Analytics Dashboard" />

      {/* Metrics Cards */}
      <DashboardMetricsGrid metrics={metricsData} />

      {/* Analytics Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/admin/analytics/sales"
          className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <FiTrendingUp className="h-8 w-8 text-pink-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Sales Analytics
              </h3>
              <p className="text-sm text-gray-600">
                View detailed revenue data and trends
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/analytics/users"
          className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <FiPieChart className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                User Analytics
              </h3>
              <p className="text-sm text-gray-600">
                Customer acquisition and behavior
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/analytics/products"
          className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <FiBarChart2 className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Product Analytics
              </h3>
              <p className="text-sm text-gray-600">
                Performance metrics for your products
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts and Tables */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Popular Products
          </h2>
          <PopularProductsChart data={stats.popularProducts} />
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Orders by Status
          </h2>
          <OrderStatusChart data={stats.ordersByStatus} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            View All Orders
          </Link>
        </div>
        <RecentOrdersTable orders={stats.recentOrders} />
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;

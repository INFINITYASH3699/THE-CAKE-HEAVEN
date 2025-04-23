// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiAlertCircle,
  FiPieChart,
} from "react-icons/fi";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: Order[];
  popularProducts: Product[];
  lowStockProducts: LowStockProduct[];
  ordersByStatus: StatusCount[];
  salesByCategory?: CategorySales[];
}

interface StatusCount {
  _id: string;
  count: number;
}

// Define proper types instead of using any
interface Order {
  _id: string;
  orderNumber?: string;
  user: {
    name: string;
    email: string;
  };
  totalPrice: number;
  status: string;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  count: number; // quantity sold
  revenue?: number;
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  category?: string;
}

interface CategorySales {
  _id: string; // category name
  sales: number;
  count: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Partial<DashboardStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/analytics/dashboard`);
        console.log("Dashboard API response:", response.data);
        
        // Transform the data to match our interface if needed
        const transformedData: Partial<DashboardStats> = {
          totalRevenue: response.data.totalRevenue,
          totalOrders: response.data.totalOrders,
          totalUsers: response.data.totalUsers,
          totalProducts: response.data.totalProducts,
          recentOrders: response.data.recentOrders,
          popularProducts: response.data.popularProducts,
          lowStockProducts: response.data.lowStockProducts || [],
          ordersByStatus: response.data.ordersByStatus,
          // Derive sales by category from the response if available
          salesByCategory: response.data.salesByCategory,
        };
        
        setStats(transformedData);
        setError("");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-indigo-100 text-indigo-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // For the formatDate function
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      console.error("Error formatting date");
      return dateString;
    }
  };

  // For the formatStatus function
  const formatStatus = (status: string) => {
    if (!status) return "Unknown";

    try {
      return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } catch {
      return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error && !stats.totalOrders) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Dashboard
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setTimeRange("day")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              timeRange === "day"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              timeRange === "week"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              timeRange === "month"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-pink-100 p-3 mr-4">
            <FiDollarSign className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              ₹{(stats.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FiShoppingBag className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalOrders || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FiUsers className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalUsers || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FiPackage className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Products</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalProducts || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-pink-600 hover:text-pink-700"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(stats.recentOrders) &&
                  stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="hover:text-pink-600"
                            >
                              #{order._id.slice(-6)}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.user?.name || "Unknown Customer"}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No recent orders available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Popular Products
            </h2>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-pink-600 hover:text-pink-700"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Units Sold
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(stats.popularProducts) &&
                  stats.popularProducts.length > 0 ? (
                    stats.popularProducts.map((product) => {
                      // Calculate revenue if not provided
                      const revenue = product.revenue || 
                        (product.count * product.price);
                        
                      return (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              <Link
                                href={`/admin/products/${product._id}`}
                                className="hover:text-pink-600"
                              >
                                {product.name}
                              </Link>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.count}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            ₹{revenue.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No top selling products available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600">
                <FiAlertCircle className="h-5 w-5" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              Low Stock Products
            </h2>
          </div>
          <div className="p-6">
            {!Array.isArray(stats.lowStockProducts) ||
            stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-2">
                All products are well-stocked
              </p>
            ) : (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 mr-3">
                        <span className="text-sm font-medium">
                          {product.stock}
                        </span>
                      </span>
                      <div>
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="text-sm font-medium text-gray-900 hover:text-pink-600"
                        >
                          {product.name}
                        </Link>
                        {product.category && (
                          <div className="text-xs text-gray-500">{product.category}</div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200"
                    >
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                <FiPieChart className="h-5 w-5" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              Orders by Status
            </h2>
          </div>
          <div className="p-6">
            {!Array.isArray(stats.ordersByStatus) ||
            stats.ordersByStatus.length === 0 ? (
              <p className="text-gray-500 text-center py-2">
                No order status data available
              </p>
            ) : (
              <div className="space-y-4">
                {stats.ordersByStatus.map((item) => {
                  const total = Array.isArray(stats.ordersByStatus)
                    ? stats.ordersByStatus.reduce(
                        (sum, s) => sum + s.count,
                        0
                      )
                    : 1;
                  const percentage =
                    total > 0 ? (item.count / total) * 100 : 0;

                  return (
                    <div
                      key={item._id}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item._id)}`}>
                            {formatStatus(item._id)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.count} orders
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-pink-600 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
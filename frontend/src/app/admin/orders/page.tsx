// src/app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

import { OrdersFilters } from "@/components/admin/orders/OrdersFilters";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { Pagination } from "@/components/admin/orders/Pagination";

interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  status: string;
  paymentMethod: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateRange, setDateRange] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/orders", {
          params: {
            search: searchQuery || undefined,
            status: status !== "all" ? status : undefined,
            sort: getSortParam(sortBy),
            dateRange: dateRange !== "all" ? dateRange : undefined,
            page,
            limit: 10,
          },
        });

        if (response.data.orders) {
          setOrders(response.data.orders);
          setTotalPages(response.data.pages || 1);
          setTotalOrders(response.data.total || response.data.orders.length);
        } else if (Array.isArray(response.data)) {
          setOrders(response.data);
          setTotalPages(1);
          setTotalOrders(response.data.length);
        } else {
          throw new Error("Unexpected API response format");
        }

        setError("");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchQuery, status, sortBy, dateRange, page]);

  // Map sort options to API parameters
  const getSortParam = (sortOption: string) => {
    switch (sortOption) {
      case "oldest":
        return "createdAt";
      case "price-high":
        return "-totalPrice";
      case "price-low":
        return "totalPrice";
      case "newest":
      default:
        return "-createdAt";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // Make API call to update the status
      await apiClient.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });

      // Update local state after successful API call
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Order status updated to ${formatStatus(newStatus)}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const exportOrders = async () => {
    try {
      // This would typically call an API endpoint that returns CSV/Excel data
      // For now, just show a toast notification
      toast.success("Export feature will be implemented soon!");
    } catch (err) {
      toast.error("Failed to export orders");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Orders
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
      <OrdersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        exportOrders={exportOrders}
      />

      <OrdersTable
        orders={orders}
        loading={loading}
        error={error}
        formatDate={formatDate}
        setOrders={setOrders} // Pass setOrders to the OrdersTable
      />

      {orders.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalOrders={totalOrders}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;

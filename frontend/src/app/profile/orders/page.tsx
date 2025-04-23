// profile/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import apiClient from "@/lib/api";
import {
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiX,
  FiShoppingBag,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
  customizations?: {
    messageOnCake?: string;
    specialInstructions?: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  estimatedDeliveryDate?: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get authentication state from Redux
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchOrders = async () => {
      // Only fetch if user is authenticated
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Make sure the API endpoint is correct and the token is being sent
        const response = await apiClient.get("/api/orders/myorders");

        // Log the response to help debug
        console.log("Orders API response:", response.data);

        // Check if the response has the expected format
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else if (response.data && Array.isArray(response.data.orders)) {
          // Some APIs wrap the array in an object
          setOrders(response.data.orders);
        } else {
          // If it's not in the expected format, set an empty array
          console.error("Unexpected orders data format:", response.data);
          setOrders([]);
          setError("Received unexpected data format from the server.");
        }
      } catch (err: any) {
        console.error("Error fetching orders:", err);

        // More detailed error logging
        if (err.response) {
          console.error("Error response:", {
            status: err.response.status,
            data: err.response.data,
          });

          // Handle unauthorized errors specifically
          if (err.response.status === 401) {
            setError("Not authorized. Please log in again.");
          } else {
            setError(
              `Failed to load orders. Server error: ${err.response.status}`
            );
          }
        } else if (err.request) {
          console.error("No response received:", err.request);
          setError("Failed to load orders. No response from server.");
        } else {
          console.error("Error setting up request:", err.message);
          setError(`Failed to load orders: ${err.message}`);
        }

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token]);

  // Safely filter orders (ensuring we're working with an array)
  const filteredOrders = Array.isArray(orders)
    ? orders
        .filter((order) => {
          if (filter === "all") return true;
          if (filter === "processing")
            return ["processing", "confirmed", "preparing"].includes(
              order.status
            );
          if (filter === "shipping")
            return ["shipped", "out_for_delivery"].includes(order.status);
          if (filter === "delivered") return order.status === "delivered";
          if (filter === "cancelled") return order.status === "cancelled";
          return true;
        })
        .filter((order) => {
          if (!searchQuery) return true;
          return (
            order.orderNumber
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.orderItems.some((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        })
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // If not authenticated, show a message
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <FiShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Not Logged In
        </h3>
        <p className="text-gray-500 mb-6">Please log in to view your orders</p>
        <Link
          href="/login"
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">My Orders</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders by order number or item name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "all"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("processing")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "processing"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter("shipping")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "shipping"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Shipping
          </button>
          <button
            onClick={() => setFilter("delivered")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "delivered"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "cancelled"
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <FiFilter className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : `You don't have any ${filter !== "all" ? filter : ""} orders yet.`}
          </p>
          {(searchQuery || filter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
              className="mt-4 text-pink-600 hover:text-pink-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <span
                        className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Order Total:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      href={`/shop/order/${order._id}`}
                      className="flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm"
                    >
                      View Details
                      <FiChevronRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Items in this order:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      +{order.orderItems.length - 3} more items
                    </div>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["delivered", "shipped", "out_for_delivery"].includes(
                    order.status
                  ) && (
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">
                      Track Order
                    </button>
                  )}
                  {order.status === "delivered" && (
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">
                      Write a Review
                    </button>
                  )}
                  {["processing", "confirmed"].includes(order.status) && (
                    <button className="px-4 py-2 border border-red-300 rounded-md text-red-700 text-sm font-medium hover:bg-red-50">
                      Cancel Order
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">
                    Need Help?
                  </button>
                  {order.status === "delivered" && (
                    <button className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

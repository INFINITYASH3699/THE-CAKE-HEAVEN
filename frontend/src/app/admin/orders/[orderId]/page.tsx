// src/app/admin/orders/[orderId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";

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

const AdminOrderDetailPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { orderId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/orders/${orderId}`);
        setOrder(response.data);
        setError("");
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Order Details
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => router.refresh()} // Use router.refresh() instead
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center">Order not found</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-pink-600 hover:text-pink-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Orders
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Order Details
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Order Information
            </h2>
            <p>
              <span className="font-semibold">Order Number:</span>{" "}
              {order.orderNumber}
            </p>
            <p>
              <span className="font-semibold">Order Date:</span>{" "}
              {formatDate(order.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <OrderStatusBadge status={order.status} />
            </p>
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {order.paymentMethod
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
            <p>
              <span className="font-semibold">Total Price:</span> ₹
              {order.totalPrice.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Payment Status:</span>{" "}
              {order.isPaid ? (
                <span className="text-green-600">Paid</span>
              ) : (
                <span className="text-red-600">Unpaid</span>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Customer Information
            </h2>
            <p>
              <span className="font-semibold">Name:</span> {order.user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {order.user.email}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Order Items
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Item Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">
                      ₹{item.price?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;

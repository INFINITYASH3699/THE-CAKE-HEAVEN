// components/admin/orders/OrdersTable.tsx
import React from "react";
import Link from "next/link";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { OrderStatusBadge } from "./OrderStatusBadge";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

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

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  error: string;
  formatDate: (dateString: string) => string;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  error,
  formatDate,
  setOrders,
}) => {
  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await apiClient.delete(`/api/orders/${orderId}`);
      toast.success("Order deleted successfully!");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (err: any) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order. Please try again.");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success(`Order status updated to ${formatStatus(newStatus)}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order
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
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="hover:text-pink-600"
                      >
                        {order.orderNumber}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.paymentMethod
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.isPaid ? (
                        <span className="text-green-600">Paid</span>
                      ) : (
                        <span className="text-red-600">Unpaid</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {order.status !== "delivered" &&
                      order.status !== "cancelled" ? (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">
                            Out for Delivery
                          </option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      ) : null}
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Order"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  {loading
                    ? "Loading orders..."
                    : error
                      ? "Error loading orders"
                      : "No orders found. Try adjusting your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

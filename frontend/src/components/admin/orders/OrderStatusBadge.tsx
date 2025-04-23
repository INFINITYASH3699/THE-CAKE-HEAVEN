// components/admin/orders/OrderStatusBadge.tsx
import React from "react";

interface OrderStatusBadgeProps {
  status: string;
}

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

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
    >
      {formatStatus(status)}
    </span>
  );
};

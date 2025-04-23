// components/admin/orders/OrdersFilters.tsx
import React from "react";
import { FiSearch, FiDownload } from "react-icons/fi";

interface OrdersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  status: string;
  setStatus: (status: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  exportOrders: () => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  status,
  setStatus,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy,
  exportOrders,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <button
          onClick={exportOrders}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiDownload className="mr-2 h-5 w-5" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status:
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="all">All</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label
                htmlFor="dateRange"
                className="text-sm font-medium text-gray-700"
              >
                Date:
              </label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label
                htmlFor="sortBy"
                className="text-sm font-medium text-gray-700"
              >
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

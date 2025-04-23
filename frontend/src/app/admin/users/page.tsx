// src/app/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import {
  FiSearch,
  FiMail,
  FiEye,
  FiEdit2,
  FiLock,
  FiUserX,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  orders?: number;
  totalSpent?: number;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showInactive, setShowInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = {
          search: searchQuery || undefined,
          role: role !== "all" ? role : undefined,
          sort: getSortParam(sortBy),
          status: !showInactive ? "active" : undefined,
          page,
          limit: 10,
        };

        // Make API request - note the corrected path to match your backend
        const response = await apiClient.get("/api/auth/admin/users", { params });

        // Process response data
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setTotalPages(1);
          setTotalUsers(response.data.length);
        } else if (response.data && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
          setTotalPages(
            response.data.pages || Math.ceil(response.data.total / 10) || 1
          );
          setTotalUsers(response.data.total || response.data.users.length);
        } else {
          throw new Error("Unexpected API response format");
        }

        setErrorMessage("");
      } catch (err) {
        console.error("Error fetching users:", err);
        setErrorMessage(
          "Failed to load users. Please check your API endpoint."
        );
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, role, sortBy, showInactive, page]);

  // Map sort options to API parameters
  const getSortParam = (sortOption: string) => {
    switch (sortOption) {
      case "oldest":
        return "createdAt";
      case "name-asc":
        return "name";
      case "name-desc":
        return "-name";
      case "orders-desc":
        return "-orders";
      case "spent-desc":
        return "-totalSpent";
      case "newest":
      default:
        return "-createdAt";
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Use the path that matches your backend API
      await apiClient.patch(`/api/auth/users/${userId}/status`, {
        isActive: !currentStatus,
      });

      // Update local state after successful API call
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );

      toast.success(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <Link
          href="/admin/users/invite"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
        >
          <FiMail className="mr-2 h-5 w-5" />
          Invite User
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
              <p className="text-sm text-red-700 mt-2">
                Make sure your backend has the proper API endpoints set up.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Role:
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="all">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
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
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="orders-desc">Most Orders</option>
                <option value="spent-desc">Highest Spend</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={() => setShowInactive(!showInactive)}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label
                htmlFor="showInactive"
                className="ml-2 text-sm text-gray-700"
              >
                Show inactive users
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Email
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
                  Role
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Joined
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Activity
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
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.orders || 0} orders • ₹
                            {user.totalSpent?.toLocaleString() || 0}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email || "No email"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleToggleStatus(user._id, user.isActive)
                        }
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div
                        className={`text-sm ${user.role === "admin" ? "text-pink-600 font-medium" : "text-gray-900"}`}
                      >
                        {user.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : "Unknown"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.lastLogin ? (
                          <>Last login: {formatDate(user.lastLogin)}</>
                        ) : (
                          "Never logged in"
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/users/${user._id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit User"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={async () => {
                            try {
                              await apiClient.post(
                                `/auth/users/${user._id}/reset-password`
                              );
                              toast.success(
                                `Password reset email sent to ${user.email}`
                              );
                            } catch (err) {
                              toast.error(
                                "Failed to send password reset email"
                              );
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Reset Password"
                        >
                          <FiLock className="h-5 w-5" />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to ${user.isActive ? "deactivate" : "activate"} this user?`
                                )
                              ) {
                                handleToggleStatus(user._id, user.isActive);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title={
                              user.isActive
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            <FiUserX className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    {loading
                      ? "Loading users..."
                      : "No users found. Try adjusting your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {users.length > 0 ? (page - 1) * 10 + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(page * 10, totalUsers)}
                </span>{" "}
                of <span className="font-medium">{totalUsers}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Simple pagination for 1-5 pages for clarity */}
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pageNum
                          ? "z-10 bg-pink-50 border-pink-500 text-pink-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && page < totalPages - 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}

                {totalPages > 5 && page >= totalPages - 2 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === totalPages
                        ? "z-10 bg-pink-50 border-pink-500 text-pink-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    page === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;

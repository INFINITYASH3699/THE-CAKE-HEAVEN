// app/admin/analytics/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Brush,
  LabelList,
} from "recharts";
import { fetchUserAnalytics } from "@/services/analyticsService";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import StatCard from "@/components/admin/analytics/StatCard";

const UserAnalyticsPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUserAnalytics = async () => {
      try {
        setLoading(true);
        const data = await fetchUserAnalytics();
        setUserData(data);
        setError("");
      } catch (err) {
        console.error("Error loading user analytics:", err);
        setError("Failed to load user analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadUserAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="User Analytics"
          backButtonText="Back to Dashboard"
          backButtonLink="/admin/analytics"
        />
        <LoadingState />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="User Analytics"
          backButtonText="Back to Dashboard"
          backButtonLink="/admin/analytics"
        />
        <ErrorState
          message={error || "Failed to load user analytics data"}
          buttonText="Try Again"
          onButtonClick={() => window.location.reload()}
        />
      </div>
    );
  }

  // Calculate total users and active users
  const totalUsers = userData.usersByDate.reduce(
    (total: number, item: any) => total + item.count,
    0
  );

  // Calculate returning customers (users with more than 1 order)
  const returningCustomers = userData.userRetention
    .filter((item: any) => item._id > 1)
    .reduce((total: number, item: any) => total + item.userCount, 0);

  // Calculate retention rate
  const retentionRate =
    totalUsers > 0 ? (returningCustomers / totalUsers) * 100 : 0;

  // Format user registration data for chart
  const userRegistrationData = userData.usersByDate.map((item: any) => ({
    date: item._id,
    users: item.count,
  }));

  // Format user retention data for chart
  const userRetentionData = userData.userRetention.map((item: any) => ({
    orders: item._id === 1 ? "1 order" : `${item._id} orders`,
    users: item.userCount,
  }));

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title="User Analytics"
        backButtonText="Back to Dashboard"
        backButtonLink="/admin/analytics"
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Users" value={totalUsers} icon="users" />
        <StatCard
          title="Returning Customers"
          value={returningCustomers}
          icon="users"
        />
        <StatCard
          title="Retention Rate"
          value={`${retentionRate.toFixed(1)}%`}
          icon="conversion"
        />
      </div>

      {/* User registration trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          User Registration Trend
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={userRegistrationData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, "New Users"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#EC4899"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User retention chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          User Retention (Orders per User)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={userRetentionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="orders" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, "Users"]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="users" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top customers table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Top Customers by Order Value
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Order Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.topCustomers.map((customer: any) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.ordersCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{customer.averageOrderValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsPage;

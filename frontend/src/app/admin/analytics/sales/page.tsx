// app/admin/analytics/sales/page.tsx
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchSalesAnalytics } from "@/services/analyticsService";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import StatCard from "@/components/admin/analytics/StatCard";
import { format, parseISO } from "date-fns";

const SalesAnalyticsPage = () => {
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSalesAnalytics = async () => {
      try {
        setLoading(true);
        const data = await fetchSalesAnalytics();
        setSalesData(data);
        setError("");
      } catch (err) {
        console.error("Error loading sales analytics:", err);
        setError("Failed to load sales analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadSalesAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="Sales Analytics"
          backButtonText="Back to Dashboard"
          backButtonLink="/admin/analytics"
        />
        <LoadingState />
      </div>
    );
  }

  if (error || !salesData) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="Sales Analytics"
          backButtonText="Back to Dashboard"
          backButtonLink="/admin/analytics"
        />
        <ErrorState
          message={error || "Failed to load sales analytics data"}
          buttonText="Try Again"
          onButtonClick={() => window.location.reload()}
        />
      </div>
    );
  }

  // Format sales by date for chart
  const salesChartData = salesData.salesByDate.map((item: any) => ({
    date: format(parseISO(item._id), "MMM dd"),
    sales: item.sales,
    orders: item.count,
  }));

  // Calculate the average order value
  const aov = salesData.averageOrderValue.average || 0;

  // Format sales by category for chart
  const categoryChartData = salesData.salesByCategory.map((item: any) => ({
    name: item._id,
    value: item.sales,
    count: item.count,
  }));

  // Colors for the category chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#EC4899",
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title="Sales Analytics"
        backButtonText="Back to Dashboard"
        backButtonLink="/admin/analytics"
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={`₹${salesData.averageOrderValue.total.toFixed(2)}`}
          icon="revenue"
        />
        <StatCard
          title="Total Orders"
          value={salesData.averageOrderValue.count}
          icon="orders"
        />
        <StatCard
          title="Average Order Value"
          value={`₹${aov.toFixed(2)}`}
          icon="average"
        />
      </div>

      {/* Sales over time chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Sales Trend (Last 30 Days)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toFixed(2)}`,
                  "Revenue",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#EC4899"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders over time chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Order Volume (Last 30 Days)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, "Orders"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category distribution and top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Sales by Category
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {categoryChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `₹${value.toFixed(2)}`,
                    "Revenue",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top selling products */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Top Selling Products
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesData.topSellingProducts.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{product.revenue.toFixed(2)}
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

export default SalesAnalyticsPage;

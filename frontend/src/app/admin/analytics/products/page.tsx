// app/admin/analytics/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Link from "next/link";
import { fetchProductAnalytics } from "@/services/analyticsService";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import StatCard from "@/components/admin/analytics/StatCard";
import { createSafeTooltip } from "@/utils/chartHelpers";

const ProductAnalyticsPage = () => {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProductAnalytics = async () => {
      try {
        setLoading(true);
        const data = await fetchProductAnalytics();
        setProductData(data);
        setError("");
      } catch (err) {
        console.error("Error loading product analytics:", err);
        setError("Failed to load product analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadProductAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="Product Analytics"
          backButtonText="Back to Dashboard"
          backButtonLink="/admin/analytics"
        />
        <LoadingState />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="Product Analytics"
          backButtonText="Back to Dashboard"
          backButtonLink="/admin/analytics"
        />
        <ErrorState
          message={error || "Failed to load product analytics data"}
          buttonText="Try Again"
          onButtonClick={() => window.location.reload()}
        />
      </div>
    );
  }

  // Calculate total revenue and products sold
  const totalRevenue = productData.topProductsByRevenue.reduce(
    (total: number, item: any) => total + item.revenue,
    0
  );

  const totalSold = productData.topProductsByRevenue.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );

  // Calculate total categories
  const totalCategories = productData.productsByCategory.length;

  // Format top products by revenue for chart
  const topProductsChartData = productData.topProductsByRevenue.map(
    (item: any) => ({
      name:
        item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name,
      value: item.revenue,
      fullName: item.name,
      quantity: item.quantity,
    })
  );

  // Format products by category for chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#EC4899",
  ];

  const categoryChartData = productData.productsByCategory.map((item: any) => ({
    name: item._id,
    value: item.count,
  }));

  // Format ratings distribution for chart
  const ratingsChartData = [];
  for (let i = 1; i <= 5; i++) {
    const foundRating = productData.ratingsDistribution.find(
      (item: any) => item._id === i
    );
    ratingsChartData.push({
      name: `${i} Star`,
      value: foundRating ? foundRating.count : 0,
    });
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title="Product Analytics"
        backButtonText="Back to Dashboard"
        backButtonLink="/admin/analytics"
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon="revenue"
        />
        <StatCard title="Products Sold" value={totalSold} icon="products" />
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon="products"
        />
      </div>

      {/* Top products by revenue */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Top Products by Revenue
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProductsChartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toFixed(2)}`,
                  "Revenue",
                ]}
                content={createSafeTooltip((payload) => (
                  <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {payload[0].payload.fullName}
                    </p>
                    <p className="text-sm text-gray-600">{`Revenue: ₹${payload[0].value.toFixed(2)}`}</p>
                    <p className="text-sm text-gray-600">{`Quantity Sold: ${payload[0].payload.quantity}`}</p>
                  </div>
                ))}
              />
              <Bar dataKey="value" fill="#EC4899" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category and rating charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Products by Category
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
                <Tooltip formatter={(value: number) => [value, "Products"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ratings distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Product Ratings Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingsChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [value, "Products"]} />
                <Bar dataKey="value" fill="#FFBB28" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low stock products */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            Low Stock Products
          </h2>
          <Link
            href="/admin/products"
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            View All Products
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productData.lowStockProducts.map((product: any) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock <= 2 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {product.stock} left
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="text-pink-600 hover:text-pink-900"
                    >
                      Update Stock
                    </Link>
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

export default ProductAnalyticsPage;

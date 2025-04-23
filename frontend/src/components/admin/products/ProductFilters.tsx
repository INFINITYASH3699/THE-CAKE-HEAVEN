// components/admin/products/ProductFilters.tsx
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { CategoryOption } from "@/app/admin/products/page";
import React from "react";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  showInactive: boolean;
  setShowInactive: (value: boolean) => void;
  categories: CategoryOption[];
  loadingCategories: boolean;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  sortBy,
  setSortBy,
  showInactive,
  setShowInactive,
  categories,
  loadingCategories,
  onApplyFilters,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onApplyFilters();
              }
            }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
            disabled={loadingCategories}
          >
            <option value="">All Categories</option> {/* Add default option */}
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="sortBy"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
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
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>

          <div className="flex items-center ml-4">
            {" "}
            {/* Adjusted margin */}
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
              Show inactive
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onApplyFilters}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Apply Filters
        </button>
        <button
          type="button"
          onClick={onResetFilters}
          className="ml-2 inline-flex items-center px-3 py-2 border border-pink-500 shadow-sm text-sm font-medium rounded-md text-pink-600 bg-white hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;

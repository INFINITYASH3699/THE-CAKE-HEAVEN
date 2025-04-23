// app/shop/category/[categoryName]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // Add useCallback
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "@/components/shop/category/ProductList";
import FilterSidebar from "@/components/shop/category/FilterSidebar";
import Breadcrumb from "@/components/shop/category/Breadcrumb";
import SortDropdown from "@/components/shop/category/SortDropdown";
import {
  fetchProducts,
  fetchFilterOptions,
} from "@/redux/slices/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { FiFilter } from "react-icons/fi";

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params.categoryName as string;
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  // Now using the interfaces directly without type assertion
  const { products, loading, error, totalPages, filterOptions } = useSelector(
    (state: RootState) => state.products
  );

  // Extract filter values from URL params - wrap in useCallback to prevent re-creation on each render
  const getFilters = useCallback(() => {
    const filters: Record<string, string> = {};
    if (searchParams.has("minPrice"))
      filters.minPrice = searchParams.get("minPrice") || "";
    if (searchParams.has("maxPrice"))
      filters.maxPrice = searchParams.get("maxPrice") || "";
    if (searchParams.has("flavor"))
      filters.flavor = searchParams.get("flavor") || "";
    if (searchParams.has("shape"))
      filters.shape = searchParams.get("shape") || "";
    if (searchParams.has("layer"))
      filters.layer = searchParams.get("layer") || "";
    if (searchParams.has("occasion"))
      filters.occasion = searchParams.get("occasion") || "";
    if (searchParams.has("cakeType"))
      filters.cakeType = searchParams.get("cakeType") || "";
    if (searchParams.has("eggOrEggless"))
      filters.eggOrEggless = searchParams.get("eggOrEggless") || "";
    return filters;
  }, [searchParams]);

  useEffect(() => {
    // Fetch filter options when component mounts
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    // Fetch products when category, page, or filters change
    const filters = getFilters();

    // Get category from URL
    const category = categoryName
      ? decodeURIComponent(categoryName as string)
      : "";

    // Build query params according to what your API expects
    const queryParams = {
      // If it's "cakes" or other plural, you might need to handle that on the server side
      // or convert here
      mainCategory: category !== "all" ? category : undefined,
      page: currentPage,
      sort:
        sortOption === "price-low-high"
          ? "price-low"
          : sortOption === "price-high-low"
            ? "price-high"
            : sortOption,
      pageSize: 12, // Add this to get proper pagination
      ...filters,
    };

    console.log("Fetching products with params:", queryParams);
    dispatch(fetchProducts(queryParams));
  }, [
    dispatch,
    categoryName,
    currentPage,
    sortOption,
    searchParams,
    getFilters,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const displayCategoryName = categoryName
    ? decodeURIComponent(categoryName)
    : "All Products";

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb category={displayCategoryName} />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          {displayCategoryName}
        </h1>
        <div className="flex items-center">
          <SortDropdown value={sortOption} onChange={handleSortChange} />
          <button
            className="ml-3 md:hidden flex items-center px-3 py-2 bg-pink-100 text-pink-600 rounded-md"
            onClick={toggleFilters}
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div
          className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-1/4 lg:w-1/5`}
        >
          <FilterSidebar
            filterOptions={filterOptions}
            currentFilters={getFilters()}
          />
        </div>

        <div className="w-full md:w-3/4 lg:w-4/5">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or check another category.
              </p>
            </div>
          ) : (
            <>
              <ProductList products={products} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-md ${
                            currentPage === page
                              ? "bg-pink-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

// app/admin/products/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductsTable from "@/components/admin/products/ProductsTable";
import ProductFilters from "@/components/admin/products/ProductFilters";
import ProductBulkActions from "@/components/admin/products/ProductBulkActions";
import ProductPagination from "@/components/admin/products/ProductPagination";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import {
  fetchProducts,
  fetchCategories,
  deleteProduct,
  updateProductStatus,
} from "@/services/productService";

// Product type definition
export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  mainCategory: string;
  subCategory?: string;
  flavor: string;
  isActive: boolean;
  images: string[];
  createdAt: string;
  [key: string]: string | number | boolean | string[] | null | undefined;
}

export interface CategoryOption {
  value: string;
  label: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(""); // Changed initial state to empty string
  const [sortBy, setSortBy] = useState("newest");
  const [showInactive, setShowInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<CategoryOption[]>([
    { value: "", label: "All Categories" }, // Changed initial state
  ]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const router = useRouter();

  // Debounce search query to prevent excessive API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const categoryOptions = await fetchCategories();
      // Ensure that the "All Categories" option is always the first one
      setCategories([
        { value: "", label: "All Categories" },
        ...categoryOptions,
      ]);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Map sort options to backend parameters
  const getSortParam = (sortOption: string) => {
    switch (sortOption) {
      case "newest":
        return "-createdAt";
      case "oldest":
        return "createdAt";
      case "price-low":
        return "price";
      case "price-high":
        return "-price";
      case "name-asc":
        return "name";
      case "name-desc":
        return "-name";
      default:
        return "-createdAt";
    }
  };

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params for API
      const params = {
        page,
        limit: 10,
        sort: getSortParam(sortBy),
        keyword: debouncedSearchQuery.trim() || undefined,
        mainCategory: category || undefined, // Send undefined instead of "all"
        status: !showInactive ? "active" : undefined,
      };

      // Call API service
      const result = await fetchProducts(params);

      setProducts(result.products);
      setTotalPages(result.totalPages);
      setTotalProducts(result.total);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, category, sortBy, showInactive, page]);

  // Initial data load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset to page 1 when search, category or sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, category, sortBy, showInactive]);

  const handleToggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleToggleAllProducts = () => {
    setSelectedProducts((prev) =>
      prev.length === products.length ? [] : products.map((p) => p._id)
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedProducts.length) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} selected products?`
      )
    ) {
      try {
        setDeleteLoading(true);

        // Delete from API - one by one
        await Promise.all(
          selectedProducts.map((productId) => deleteProduct(productId))
        );

        // Update UI state after successful deletion
        setProducts((prev) =>
          prev.filter((p) => !selectedProducts.includes(p._id))
        );

        setTotalProducts((prev) => prev - selectedProducts.length);
        setSelectedProducts([]);

        toast.success(
          `${selectedProducts.length} products deleted successfully!`
        );

        // Handle page change if needed
        if (products.length === selectedProducts.length && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error("Error deleting products:", err);
        toast.error("Failed to delete products. Please try again.");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setStatusUpdateLoading(productId);

        // Call the API to delete the product
        await deleteProduct(productId);

        // Update local state after successful API call
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        setTotalProducts((prev) => prev - 1);
        toast.success("Product deleted successfully!");

        // Handle page change if needed
        if (products.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error("Failed to delete product. Please try again.");
      } finally {
        setStatusUpdateLoading(null);
      }
    }
  };

  const handleToggleStatus = async (
    productId: string,
    currentStatus: boolean
  ) => {
    try {
      setStatusUpdateLoading(productId);

      // Call API to update product status
      await updateProductStatus(productId, !currentStatus);

      // Update UI after successful status change
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isActive: !currentStatus } : p
        )
      );

      toast.success(
        `Product ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (err) {
      console.error("Error updating product status:", err);
      toast.error("Failed to update product status. Please try again.");
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCategory(""); // Changed to empty string
    setSortBy("newest");
    setShowInactive(false);
    setPage(1);
    loadProducts();
  };

  // **Apply Filters Function**: To allow it to be passed as props
  const handleApplyFilters = () => {
    setPage(1); // Reset to page 1 before applying filters
    loadProducts(); // Reload products with current filter settings
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title="Products"
        addButtonText="Add Product"
        addButtonLink="/admin/products/create"
      />

      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showInactive={showInactive}
        setShowInactive={setShowInactive}
        categories={categories}
        loadingCategories={loadingCategories}
        onApplyFilters={handleApplyFilters} // Changed to handleApplyFilters
        onResetFilters={handleResetFilters}
      />

      {selectedProducts.length > 0 && (
        <ProductBulkActions
          selectedCount={selectedProducts.length}
          onDelete={handleDeleteSelected}
          onClearSelection={() => setSelectedProducts([])}
          deleteLoading={deleteLoading}
        />
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          buttonText="Try Again"
          onButtonClick={loadProducts}
        />
      ) : (
        <>
          <ProductsTable
            products={products}
            selectedProducts={selectedProducts}
            onToggleSelection={handleToggleProductSelection}
            onToggleAll={handleToggleAllProducts}
            onDelete={handleDeleteProduct}
            onToggleStatus={handleToggleStatus}
            statusUpdateLoading={statusUpdateLoading}
          />

          {products.length > 0 && (
            <ProductPagination
              currentPage={page}
              totalPages={totalPages}
              startItem={(page - 1) * 10 + 1}
              endItem={Math.min(page * 10, totalProducts)}
              totalItems={totalProducts}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;

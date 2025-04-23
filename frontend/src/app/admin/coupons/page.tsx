// app/admin/coupons/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import CouponsTable from "@/components/admin/coupons/CouponsTable";
import CouponFilters from "@/components/admin/coupons/CouponFilters";
import CouponPagination from "@/components/admin/coupons/CouponPagination";
import { fetchCoupons, deleteCoupon, updateCouponStatus } from "@/services/couponService";

// Coupon type definition
export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  minimumPurchase: number;
  maximumDiscount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableTo: "all" | "category" | "product" | "user";
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
  [key: string]: string | number | boolean | null | undefined;
}

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, expired, upcoming
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
  
  const router = useRouter();

  // Debounce search query to prevent excessive API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Map sort options to backend parameters
  const getSortParam = (sortOption: string) => {
    switch (sortOption) {
      case "newest":
        return "-createdAt";
      case "oldest":
        return "createdAt";
      case "expiry-soon":
        return "validUntil";
      case "discount-high":
        return "-discountAmount";
      case "most-used":
        return "-usageCount";
      default:
        return "-createdAt";
    }
  };

  // Load coupons
  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);

      // Build query params for API
      const params = {
        page,
        limit: 10,
        sort: getSortParam(sortBy),
        keyword: debouncedSearchQuery.trim() || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      };

      // Call API service
      const result = await fetchCoupons(params);
      
      setCoupons(result.coupons);
      setTotalPages(result.totalPages);
      setTotalCoupons(result.total);
      setError("");
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons. Please try again.");
      setCoupons([]);
      setTotalPages(1);
      setTotalCoupons(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, filterStatus, sortBy, page]);

  // Initial data load
  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  // Reset to page 1 when search, status or sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, filterStatus, sortBy]);

  const handleDeleteCoupon = async (couponId: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        setStatusUpdateLoading(couponId);

        // Call the API to delete the coupon
        await deleteCoupon(couponId);

        // Update local state after successful API call
        setCoupons((prev) => prev.filter((c) => c._id !== couponId));
        setTotalCoupons((prev) => prev - 1);
        toast.success("Coupon deleted successfully!");

        // Handle page change if needed
        if (coupons.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error("Error deleting coupon:", err);
        toast.error("Failed to delete coupon. Please try again.");
      } finally {
        setStatusUpdateLoading(null);
      }
    }
  };

  const handleToggleStatus = async (
    couponId: string,
    currentStatus: boolean
  ) => {
    try {
      setStatusUpdateLoading(couponId);

      // Call API to update coupon status
      await updateCouponStatus(couponId, !currentStatus);

      // Update UI after successful status change
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === couponId ? { ...c, isActive: !currentStatus } : c
        )
      );
      
      toast.success(
        `Coupon ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (err) {
      console.error("Error updating coupon status:", err);
      toast.error("Failed to update coupon status. Please try again.");
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setFilterStatus("all");
    setSortBy("newest");
    setPage(1);
    loadCoupons();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title="Coupons"
        addButtonText="Create Coupon"
        addButtonLink="/admin/coupons/create"
      />

      <CouponFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onApplyFilters={loadCoupons}
        onResetFilters={handleResetFilters}
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          buttonText="Try Again"
          onButtonClick={loadCoupons}
        />
      ) : (
        <>
          <CouponsTable
            coupons={coupons}
            onDelete={handleDeleteCoupon}
            onToggleStatus={handleToggleStatus}
            statusUpdateLoading={statusUpdateLoading}
          />

          {coupons.length > 0 && (
            <CouponPagination
              currentPage={page}
              totalPages={totalPages}
              startItem={(page - 1) * 10 + 1}
              endItem={Math.min(page * 10, totalCoupons)}
              totalItems={totalCoupons}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminCouponsPage;
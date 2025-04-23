// app/admin/coupons/[couponId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { fetchCouponById, deleteCoupon } from "@/services/couponService";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import { format } from "date-fns";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import CouponUsageStats from "@/components/admin/coupons/CouponUsageStats";

interface CouponDetailPageProps {
  params: {
    couponId: string;
  };
}

const CouponDetailPage = ({ params }: CouponDetailPageProps) => {
  const { couponId } = params;
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCoupon = async () => {
      try {
        setLoading(true);
        const data = await fetchCouponById(couponId);
        setCoupon(data);
        setError("");
      } catch (err) {
        console.error("Error fetching coupon:", err);
        setError("Failed to load coupon details.");
      } finally {
        setLoading(false);
      }
    };

    loadCoupon();
  }, [couponId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        setIsDeleting(true);
        await deleteCoupon(couponId);
        toast.success("Coupon deleted successfully!");
        router.push("/admin/coupons");
      } catch (error) {
        console.error("Error deleting coupon:", error);
        toast.error("Failed to delete coupon.");
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="Coupon Details"
          backButtonText="Back to Coupons"
          backButtonLink="/admin/coupons"
        />
        <LoadingState />
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="Coupon Details"
          backButtonText="Back to Coupons"
          backButtonLink="/admin/coupons"
        />
        <ErrorState
          message={error || "Coupon not found"}
          buttonText="Go Back"
          onButtonClick={() => router.push("/admin/coupons")}
        />
      </div>
    );
  }

  const getCouponStatus = () => {
    if (!coupon.isActive) return "Inactive";

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom) return "Upcoming";
    if (now > validUntil) return "Expired";
    return "Active";
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const couponStatus = getCouponStatus();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title="Coupon Details"
        backButtonText="Back to Coupons"
        backButtonLink="/admin/coupons"
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Coupon Information
              </h2>
              <div className="flex space-x-2">
                <Link
                  href={`/admin/coupons/${couponId}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <FiEdit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiTrash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Coupon Code
                  </h3>
                  <p className="text-gray-900 font-medium">{coupon.code}</p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Status
                  </h3>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(couponStatus)}`}
                  >
                    {couponStatus}
                  </span>
                </div>

                <div className="w-full px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </h3>
                  <p className="text-gray-900">{coupon.description}</p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Discount Type
                  </h3>
                  <p className="text-gray-900 capitalize">
                    {coupon.discountType}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Discount Amount
                  </h3>
                  <p className="text-gray-900">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountAmount}%`
                      : `$${coupon.discountAmount.toFixed(2)}`}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Minimum Purchase
                  </h3>
                  <p className="text-gray-900">
                    {coupon.minimumPurchase > 0
                      ? `$${coupon.minimumPurchase.toFixed(2)}`
                      : "No minimum"}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Maximum Discount
                  </h3>
                  <p className="text-gray-900">
                    {coupon.maximumDiscount
                      ? `$${coupon.maximumDiscount.toFixed(2)}`
                      : "No maximum"}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Valid From
                  </h3>
                  <p className="text-gray-900">
                    {format(new Date(coupon.validFrom), "MMM dd, yyyy")}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Valid Until
                  </h3>
                  <p className="text-gray-900">
                    {format(new Date(coupon.validUntil), "MMM dd, yyyy")}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Applicable To
                  </h3>
                  <p className="text-gray-900 capitalize">
                    {coupon.applicableTo}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Usage Limit
                  </h3>
                  <p className="text-gray-900">
                    {coupon.usageLimit === null
                      ? "Unlimited"
                      : coupon.usageLimit}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Per User Limit
                  </h3>
                  <p className="text-gray-900">
                    {coupon.perUserLimit === null
                      ? "Unlimited"
                      : coupon.perUserLimit}
                  </p>
                </div>

                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Created At
                  </h3>
                  <p className="text-gray-900">
                    {format(new Date(coupon.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <CouponUsageStats coupon={coupon} />
        </div>
      </div>
    </div>
  );
};

export default CouponDetailPage;

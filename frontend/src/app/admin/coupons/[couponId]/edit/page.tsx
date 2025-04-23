// app/admin/coupons/[couponId]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchCouponById, updateCoupon } from "@/services/couponService";
import CouponForm from "@/components/admin/coupons/CouponForm";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";

interface EditCouponPageProps {
  params: {
    couponId: string;
  };
}

const EditCouponPage = ({ params }: EditCouponPageProps) => {
  const { couponId } = params;
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (couponData: any) => {
    try {
      setIsSubmitting(true);
      await updateCoupon(couponId, couponData);
      toast.success("Coupon updated successfully!");
      router.push("/admin/coupons");
    } catch (error: any) {
      console.error("Error updating coupon:", error);
      toast.error(error.response?.data?.message || "Failed to update coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader
          title="Edit Coupon"
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
          title="Edit Coupon"
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

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title={`Edit Coupon: ${coupon.code}`}
        backButtonText="Back to Coupons"
        backButtonLink="/admin/coupons"
      />

      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <CouponForm
          initialData={coupon}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText="Update Coupon"
          isEditing
        />
      </div>
    </div>
  );
};

export default EditCouponPage;

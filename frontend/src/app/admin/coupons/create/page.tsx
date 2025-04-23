// app/admin/coupons/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createCoupon } from "@/services/couponService";
import CouponForm from "@/components/admin/coupons/CouponForm";
import PageHeader from "@/components/admin/common/PageHeader";

const CreateCouponPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (couponData: any) => {
    try {
      setIsSubmitting(true);
      await createCoupon(couponData);
      toast.success("Coupon created successfully!");
      // app/admin/coupons/create/page.tsx (continued)
      router.push("/admin/coupons");
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast.error(error.response?.data?.message || "Failed to create coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader
        title="Create Coupon"
        backButtonText="Back to Coupons"
        backButtonLink="/admin/coupons"
      />
      
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <CouponForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          submitText="Create Coupon"
        />
      </div>
    </div>
  );
};

export default CreateCouponPage;
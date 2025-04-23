// services/couponService.ts
import api from "@/lib/api";

// Fetch all coupons (admin only)
export const fetchCoupons = async (params: any = {}) => {
  try {
    const response = await api.get("/api/coupons", { params });

    // Format the result to match our pagination expectations
    const { data } = response;

    // If the API doesn't return pagination info, we'll default to some values
    return {
      coupons: data,
      total: data.length,
      totalPages: 1,
      page: 1,
      ...data.pagination,
    };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

// Fetch coupon by ID (admin only)
export const fetchCouponById = async (id: string) => {
  try {
    const response = await api.get(`/api/coupons/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching coupon ${id}:`, error);
    throw error;
  }
};

// Create new coupon (admin only)
export const createCoupon = async (couponData: any) => {
  try {
    const response = await api.post("/api/coupons", couponData);
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

// Update coupon (admin only)
export const updateCoupon = async (id: string, couponData: any) => {
  try {
    const response = await api.put(`/api/coupons/${id}`, couponData);
    return response.data;
  } catch (error) {
    console.error(`Error updating coupon ${id}:`, error);
    throw error;
  }
};

// Delete coupon (admin only)
export const deleteCoupon = async (id: string) => {
  try {
    const response = await api.delete(`/api/coupons/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting coupon ${id}:`, error);
    throw error;
  }
};

// Update coupon status (admin only)
export const updateCouponStatus = async (id: string, isActive: boolean) => {
  try {
    const response = await api.put(`/api/coupons/${id}`, { isActive });
    return response.data;
  } catch (error) {
    console.error(`Error updating coupon status ${id}:`, error);
    throw error;
  }
};

// Get active coupons for customers (public)
export const fetchActiveCoupons = async () => {
  try {
    const response = await api.get("/api/coupons/active");
    return response.data;
  } catch (error) {
    console.error("Error fetching active coupons:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Validate a coupon code (public)
export const validateCoupon = async (
  code: string,
  cartTotal: number,
  products?: any[]
) => {
  try {
    const response = await api.post("/api/coupons/validate", {
      code,
      cartTotal,
      products,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    // Extract the error message from the response
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to validate coupon. Please try again.");
  }
};

// Get coupons applicable to a specific product (public)
export const getProductCoupons = async (
  productId: string,
  categoryId?: string
) => {
  try {
    const params = {
      productId,
      categoryId,
    };

    const response = await api.get("/api/coupons/product-coupons", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching product coupons:", error);
    return [];
  }
};
// services/analyticsService.ts
import api from "@/lib/api";

// Dashboard overview statistics
export const fetchDashboardStats = async () => {
  try {
    const response = await api.get("/api/analytics/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Detailed sales analytics
export const fetchSalesAnalytics = async () => {
  try {
    const response = await api.get("/api/analytics/sales");
    return response.data;
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw error;
  }
};

// User analytics
export const fetchUserAnalytics = async () => {
  try {
    const response = await api.get("/api/analytics/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw error;
  }
};

// Product analytics
export const fetchProductAnalytics = async () => {
  try {
    const response = await api.get("/api/analytics/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    throw error;
  }
};

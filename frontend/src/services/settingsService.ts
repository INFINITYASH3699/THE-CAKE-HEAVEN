// services/settingsService.ts
import api from "@/lib/api";

// Fetch all settings
export const fetchSettings = async () => {
  try {
    const response = await api.get("/api/settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

// Update settings
export const updateSettings = async (settingsData: any) => {
  try {
    const response = await api.put("/api/settings", settingsData);
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

// Update logo
export const updateLogo = async (formData: FormData) => {
  try {
    const response = await api.post("/api/settings/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating logo:", error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfiguration = async (emailConfig: any) => {
  try {
    const response = await api.post("/api/settings/test-email", emailConfig);
    return response.data;
  } catch (error) {
    console.error("Error testing email configuration:", error);
    throw error;
  }
};

// Test payment gateway
export const testPaymentGateway = async (paymentConfig: any) => {
  try {
    const response = await api.post(
      "/api/settings/test-payment",
      paymentConfig
    );
    return response.data;
  } catch (error) {
    console.error("Error testing payment gateway:", error);
    throw error;
  }
};

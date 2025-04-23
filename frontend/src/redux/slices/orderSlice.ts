// redux/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Define interfaces for types
interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
  customizations?: {
    messageOnCake?: string;
    specialInstructions?: string;
  };
}

interface ShippingAddress {
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderDetails {
  orderFor: string;
  birthDate?: string;
  specialInstructions?: string;
}

interface OrderData {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  deliveryOption: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountAmount: number;
  couponCode?: string;
  totalPrice: number;
  orderDetails: OrderDetails;
  [key: string]: unknown;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  discountAmount: number;
  walletAmountUsed?: number;
  couponCode?: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

interface OrderState {
  order: Order | null;
  orders: Order[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// redux/slices/orderSlice.ts
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: OrderData, { rejectWithValue }) => {
    try {
      console.log("Creating order with data:", orderData);
      const response = await api.post("/api/orders", orderData);

      console.log("Order created successfully:", response.data);

      if (!response.data.order || !response.data.order._id) {
        console.error("Order created but no ID returned:", response.data);
      }

      return response.data;
    } catch (error: unknown) {
      console.error("Error creating order:", error);
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderId: string, { rejectWithValue }) => {
    try {
      console.log("Fetching order with ID:", orderId);

      // Check if it's a valid MongoDB ObjectId
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(orderId);

      if (!isValidObjectId) {
        console.error("Invalid order ID format:", orderId);
        return rejectWithValue(
          "Invalid order ID format. Please check your URL."
        );
      }

      const response = await api.get(`/api/orders/${orderId}`);
      console.log("Order details response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching order details:", error);
      const apiError = error as ApiError;

      if (apiError.response) {
        console.error("Response status:", apiError.response.status);
        console.error("Response data:", apiError.response.data);

        if (apiError.response.status === 400) {
          return rejectWithValue(
            "Invalid order ID format. Please check your URL."
          );
        } else if (apiError.response.status === 404) {
          return rejectWithValue(
            "Order not found. It may have been deleted or you may not have permission to view it."
          );
        } else if (apiError.response.status === 403) {
          return rejectWithValue(
            "You don't have permission to view this order."
          );
        } else if (apiError.response.status === 401) {
          return rejectWithValue(
            "Your session has expired. Please log in again."
          );
        }

        return rejectWithValue(
          apiError.response.data?.message ||
            `Failed to fetch order details (Status: ${apiError.response.status})`
        );
      }

      return rejectWithValue("Network error while fetching order details");
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders/myorders");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch your orders"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (
    { orderId, reason }: { orderId: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/cancel`, {
        cancelReason: reason,
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

const initialState: OrderState = {
  order: null,
  orders: [],
  loading: false,
  success: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get order details
    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get user orders
    builder.addCase(getUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(getUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Cancel order
    builder.addCase(cancelOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;

      // Update in orders list if exists
      const index = state.orders.findIndex(
        (order) => order._id === action.payload._id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetOrderSuccess } = orderSlice.actions;

export default orderSlice.reducer;

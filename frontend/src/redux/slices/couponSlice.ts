// redux/slices/couponSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { validateCoupon } from "@/services/couponService";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async (
    {
      code,
      cartTotal,
      products,
    }: { code: string; cartTotal: number; products?: any[] },
    { rejectWithValue }
  ) => {
    try {
      // Use the service function instead of direct API call
      const couponData = await validateCoupon(code, cartTotal, products);
      return couponData;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Invalid coupon code");
    }
  }
);

interface CouponState {
  coupon: {
    code: string;
    discountType: string;
    discountValue: number;
    [key: string]: unknown;
  } | null;
  discount: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupon: null,
  discount: null,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(applyCoupon.fulfilled, (state, action) => {
      state.loading = false;
      // Create a coupon object from the validation response
      state.coupon = {
        code: action.payload.code,
        discountType: action.payload.discountType,
        discountValue: action.payload.discountValue,
      };
      state.discount = action.payload.discountAmount;
    });
    builder.addCase(applyCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { removeCoupon } = couponSlice.actions;

export default couponSlice.reducer;
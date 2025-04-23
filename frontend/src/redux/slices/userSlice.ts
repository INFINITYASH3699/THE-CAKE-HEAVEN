// redux/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Define interfaces for types
interface Address {
  _id: string;
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

interface WalletTransaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  transactionType: "credit" | "debit";
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  addresses: Address[];
  walletBalance: number;
  [key: string]: unknown;
}

interface AddressData {
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

interface UserState {
  profile: UserProfile | null;
  addresses: Address[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users/profile");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/users/profile", userData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const addAddress = createAsyncThunk(
  "user/addAddress",
  async (addressData: AddressData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/users/addresses", addressData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to add address"
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async (
    {
      addressId,
      addressData,
    }: { addressId: string; addressData: Partial<AddressData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/api/users/addresses/${addressId}`,
        addressData
      );
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/users/addresses/${addressId}`);
      return { addressId, user: response.data };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

export const getWalletTransactions = createAsyncThunk(
  "user/getWalletTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/wallet/transactions");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message ||
          "Failed to fetch wallet transactions"
      );
    }
  }
);

export const addFundsToWallet = createAsyncThunk(
  "user/addFundsToWallet",
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/wallet/add", { amount });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to add funds to wallet"
      );
    }
  }
);

const initialState: UserState = {
  profile: null,
  addresses: [],
  walletBalance: 0,
  walletTransactions: [],
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Get user profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.addresses = action.payload.addresses || [];
      state.walletBalance = action.payload.walletBalance || 0;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update user profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.success = true;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Add address
    builder.addCase(addAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload.addresses;
      state.success = true;
    });
    builder.addCase(addAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Update address
    builder.addCase(updateAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload.addresses;
      state.success = true;
    });
    builder.addCase(updateAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Delete address
    builder.addCase(deleteAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.addresses = action.payload.user.addresses;
      state.success = true;
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });

    // Get wallet transactions
    builder.addCase(getWalletTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getWalletTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.walletTransactions = action.payload.transactions;
      state.walletBalance = action.payload.balance;
    });
    builder.addCase(getWalletTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add funds to wallet
    builder.addCase(addFundsToWallet.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addFundsToWallet.fulfilled, (state, action) => {
      state.loading = false;
      state.walletBalance = action.payload.balance;
      state.walletTransactions = [
        action.payload.transaction,
        ...state.walletTransactions,
      ];
      state.success = true;
    });
    builder.addCase(addFundsToWallet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
  },
});

export const { clearUserError, resetSuccess } = userSlice.actions;

export default userSlice.reducer;

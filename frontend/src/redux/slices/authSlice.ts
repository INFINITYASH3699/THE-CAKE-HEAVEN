// authSlice.ts - Updated version with forgotPassword

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/lib/api";
import { mockLogin, mockRegister } from "@/lib/mockAuth";
import {
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
  ForgotPasswordPayload, // <-- Import new type
} from "@/types"; // <-- Make sure ForgotPasswordPayload is imported

// Define wallet interface (if needed elsewhere, keep it)
interface Wallet {
  balance: number;
  history: Array<{
    amount: number;
    description: string;
    date: string;
  }>;
}

// Flag to determine whether to use mock services or real API
const USE_MOCK = false; // Set to false to use real backend

// Define the expected response structure for forgot password
interface ForgotPasswordApiResponse {
  message: string;
}

// Helper function to load auth state from localStorage
const loadAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      const userDataStr = localStorage.getItem("userData");

      if (token && userDataStr) {
        const userData = JSON.parse(userDataStr);
        return {
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          message: null, // <-- Initialize message
        };
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage:", error);
    }
  }

  return {
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    message: null, // <-- Initialize message
  };
};

// Define initial state by loading from localStorage
const initialState: AuthState = loadAuthState();

// Login response interface - for what the API returns
interface LoginResponse {
  token: string;
  user?: User;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  wallet?: Wallet;
  [key: string]: unknown; // For any other properties
}

// Helper function to save user data to localStorage
const saveUserData = (user: User | null, token: string | null) => {
  if (typeof window !== "undefined") {
    if (user && token) {
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    }
  }
};

// --- Existing Async Thunks (login, register, etc.) ---
// ... (keep your existing login, register, logout, getUserProfile, checkAuthStatus thunks here) ...

export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    // ... existing login implementation
    try {
      console.log("Attempting login with:", { email });

      let response;

      if (USE_MOCK) {
        // Use mock service
        try {
          response = await mockLogin({ email, password });
        } catch (error) {
          return rejectWithValue(
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        // Use real API
        const apiResponse = await apiClient.post("/api/auth/login", {
          email,
          password,
        });
        response = apiResponse.data;
      }

      console.log("Login response:", response);

      // Store token in localStorage
      localStorage.setItem("token", response.token);

      return response;
    } catch (error: unknown) {
      console.error("Login error:", error);

      const errorResponse = error as {
        message?: string;
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };

      console.error("Login error details:", {
        message: errorResponse.message,
        response: errorResponse.response?.data,
        status: errorResponse.response?.status,
      });

      return rejectWithValue(
        errorResponse.response?.data?.message ||
          (error instanceof Error
            ? error.message
            : "Failed to login. Please check your credentials.")
      );
    }
  }
);

export const loginAndGetProfile = createAsyncThunk<void, LoginCredentials>(
  "auth/loginAndGetProfile",
  async (credentials, { dispatch }) => {
    const loginResult = await dispatch(login(credentials));
    if (login.fulfilled.match(loginResult) && !loginResult.payload.user) {
      console.log(
        "Login successful but missing user data, fetching profile..."
      );
      await dispatch(getUserProfile());
    }
  }
);

export const register = createAsyncThunk<LoginResponse, RegisterData>(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    // ... existing register implementation
    try {
      let response;

      if (USE_MOCK) {
        // Use mock service
        try {
          response = await mockRegister({ name, email, password });
        } catch (error) {
          return rejectWithValue(
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      } else {
        // Use real API
        const apiResponse = await apiClient.post("/api/auth/signup", {
          name,
          email,
          password,
        });
        response = apiResponse.data;
      }

      console.log("Register response:", response);

      // Store token in localStorage
      localStorage.setItem("token", response.token);

      return response;
    } catch (error: unknown) {
      console.error("Register error:", error);

      // Properly type the error for Axios error responses
      const axiosError = error as {
        message?: string;
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };

      // Log more details about the error for debugging
      console.log("Registration error details:", {
        message: axiosError.message,
        responseData: axiosError.response?.data,
        status: axiosError.response?.status,
      });

      return rejectWithValue(
        axiosError.response?.data?.message ||
          "Failed to register. Please try again."
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  return null;
});

export const getUserProfile = createAsyncThunk<User, void>(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    // ... existing getUserProfile implementation
    try {
      const response = await apiClient.get("/api/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to get user profile"
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { dispatch, rejectWithValue }) => {
    // Added rejectWithValue
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        // Assume token might be invalid, try fetching profile
        return await dispatch(getUserProfile()).unwrap(); // unwrap() throws error on rejection
      } catch (error) {
        console.error("Auth check failed, token likely invalid:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        // Reject the thunk so UI can react if needed
        return rejectWithValue("Session expired or invalid.");
      }
    }
    // No token found, definitely not authenticated
    return null;
  }
);

// --- NEW: Forgot Password Async Thunk ---
export const forgotPassword = createAsyncThunk<
  ForgotPasswordApiResponse, // Type for successful return value
  ForgotPasswordPayload, // Type for the input payload (email)
  { rejectValue: string } // Type for the rejected value
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    console.log("Attempting forgot password for email:", email);
    // Use real API (adjust if you need a mock version)
    const response = await apiClient.post<ForgotPasswordApiResponse>(
      "/api/auth/forgotpassword",
      { email }
    );
    console.log("Forgot password response:", response.data);
    // Return the success message from the API response
    return response.data;
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
    };
    const errorMessage =
      axiosError.response?.data?.message ||
      "Failed to send password reset email. Please try again.";
    console.error("Forgot password error details:", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

// --- Auth Slice Definition ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear both error and message state
    clearError: (state) => {
      state.error = null;
      state.message = null; // <-- Clear message too
    },
    // Optional: Add a specific reducer to clear only the message if needed
    // clearMessage: (state) => {
    //   state.message = null;
    // }
  },
  extraReducers: (builder) => {
    builder
      // --- Existing Reducers (Login, Register, etc.) ---
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null; // Clear message on new action
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          let userData: User;
          if (action.payload.user) {
            userData = action.payload.user;
          } else {
            userData = {
              _id: action.payload._id || "",
              name: action.payload.name || "",
              email: action.payload.email || "",
              role: action.payload.role || "user",
              isActive: true, // Assuming default, adjust if needed
              // Add any other required User properties
            };
          }
          state.user = userData;
          saveUserData(userData, action.payload.token);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        if (
          action.payload ===
          "Too many requests from this IP, please try again later"
        ) {
          state.error =
            "You have made too many login attempts. Please wait a few minutes and try again.";
        } else {
          state.error =
            (action.payload as string) || "Login failed. Please try again.";
        }
      })

      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null; // Clear message on new action
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          let userData: User;
          if (action.payload.user) {
            userData = action.payload.user;
          } else {
            userData = {
              _id: action.payload._id || "",
              name: action.payload.name || "",
              email: action.payload.email || "",
              role: action.payload.role || "user",
              isActive: true, // Assuming default, adjust if needed
              // Add any other required User properties
            };
          }
          state.user = userData;
          saveUserData(userData, action.payload.token);
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          "Registration failed. Please try again.";
      })

      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear error on pending
        state.message = null; // Clear message
      })
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          if (state.token) {
            saveUserData(action.payload, state.token);
          }
        }
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        // Check if rejectWithValue was used (meaning it's likely an auth error)
        if (action.meta.rejectedWithValue) {
          state.error =
            (action.payload as string) || "Failed to fetch profile."; // Use payload if available
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          saveUserData(null, null); // Clear local storage
        } else {
          // Handle other potential errors if necessary
          state.error =
            "An unexpected error occurred while fetching the profile.";
        }
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.message = null;
      })

      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true; // Indicate loading during auth check
        state.error = null;
        state.message = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // User data returned means success
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          // Null returned (or rejected below) means not authenticated
          state.isAuthenticated = false;
          state.user = null;
          state.token = null; // Ensure token is cleared if check fails implicitly
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error =
          (action.payload as string) || "Authentication check failed."; // Show error message
      })

      // --- NEW: Forgot Password Reducers ---
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null; // Clear previous message/error
      })
      .addCase(
        forgotPassword.fulfilled,
        (state, action: PayloadAction<ForgotPasswordApiResponse>) => {
          state.isLoading = false;
          state.message = action.payload.message; // Set success message
          state.error = null; // Clear any previous error
        }
      )
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; // Set error message
        state.message = null; // Clear any previous success message
      });
  },
});

// Export the new action along with existing ones
export const { clearError } = authSlice.actions;
// Optional: export const { clearMessage } = authSlice.actions;

export default authSlice.reducer;

// src/types/index.ts
import { Product } from "./product";

export * from "./product";
// export other type files here

// Define shared interfaces
export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: {
    messageOnCake?: string;
    specialInstructions?: string;
    [key: string]: unknown;
  };
}

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  weight: string;
  images: string[];
  // Add all possible properties as optional
  description?: string;
  mainCategory?: string;
  subCategory?: string;
  flavor?: string;
  shape?: string;
  isActive?: boolean;
  [key: string]: unknown;
}
// User-related interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  wallet?: {
    balance: number;
    history: WalletTransaction[];
  };
  addresses?: Address[];
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  profileImage?: string;
  favorites?: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WalletTransaction {
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  message?: string | null;
}

// Define the type for the forgot password request payload
export interface ForgotPasswordPayload {
  email: string;
}

// Define the type for the forgot password API response (adjust if needed)
interface ForgotPasswordResponse {
  message: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register data interface
export interface RegisterData extends LoginCredentials {
  name: string;
}

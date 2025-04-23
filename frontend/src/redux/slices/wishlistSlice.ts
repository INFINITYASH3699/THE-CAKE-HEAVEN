// redux/slices/wishlistSlice.ts - Updated version
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Define a Product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  weight?: string;
  flavor?: string;
  [key: string]: unknown;
}

interface WishlistState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

// Define the async thunk for fetching the wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/auth/favorites");
      console.log("Wishlist API response:", response.data);

      // The API returns { count: number, favorites: Product[] }
      if (response.data && Array.isArray(response.data.favorites)) {
        return response.data.favorites;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }

      // If we can't determine the format, return an empty array
      return [];
    } catch (error: unknown) {
      console.error("Error fetching wishlist:", error);
      return rejectWithValue("Failed to fetch favorites");
    }
  }
);

// Add to wishlist with API
export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlistAsync",
  async (product: Product, { rejectWithValue, dispatch }) => {
    try {
      await api.post(`/api/auth/favorites/${product._id}`);
      return product; // Return the full product to add to the wishlist
    } catch (error: unknown) {
      console.error("Error adding to wishlist:", error);
      
      // If the API fails, we'll still update the local state
      dispatch(addToWishlist(product));
      
      return rejectWithValue("Failed to add to favorites on server, but updated locally");
    }
  }
);

// Remove from wishlist with API
export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlistAsync",
  async (productId: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/api/auth/favorites/${productId}`);
      return productId; // Return the ID to remove from the wishlist
    } catch (error: unknown) {
      console.error("Error removing from wishlist:", error);
      
      // If the API fails, we'll still update the local state
      dispatch(removeFromWishlist(productId));
      
      return rejectWithValue("Failed to remove from favorites on server, but updated locally");
    }
  }
);


const loadWishlistFromStorage = (): Product[] => {
  if (typeof window !== "undefined") {
    try {
      const wishlist = localStorage.getItem("wishlist");
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
      return [];
    }
  }
  return [];
};

const saveWishlistToStorage = (items: Product[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // These direct actions can still be useful for client-side state management
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const exists = state.items.some((item) => item._id === product._id);

      if (!exists) {
        state.items.push(product);
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        saveWishlistToStorage(state.items);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to wishlist async
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload;
        const exists = state.items.some((item) => item._id === product._id);
        if (!exists) {
          state.items.push(product);
          saveWishlistToStorage(state.items);
        }
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove from wishlist async
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        saveWishlistToStorage(state.items);
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;

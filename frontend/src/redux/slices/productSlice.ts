// redux/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Define interfaces for types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  mainCategory: string;
  subCategory?: string;
  stock: number;
  flavor: string;
  shape: string;
  weight: string;
  [key: string]: unknown;
}

// Export the Review interface so it can be used in other files
export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: string;
  name: string;
  createdAt: string;
}

export interface FilterOptions {
  flavors: string[];
  shapes: string[];
  layers: string[];
  occasions: string[];
  cakeTypes: string[];
  eggTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  [key: string]: unknown;
}

interface ProductsState {
  products: Product[];
  product: Product | null;
  relatedProducts: Product[];
  filterOptions: FilterOptions;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

interface ProductsResponse {
  products: Product[];
  totalPages?: number;
  currentPage?: number;
  [key: string]: unknown;
}

interface ProductParams {
  mainCategory?: string;
  subCategory?: string;
  flavor?: string;
  shape?: string;
  layer?: string;
  occasion?: string;
  cakeType?: string;
  eggOrEggless?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
  keyword?: string;
  featured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  [key: string]: unknown;
}

interface ProductReview {
  rating: number;
  comment: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const fetchProducts = createAsyncThunk<ProductsResponse, ProductParams>(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      console.log("Sending API request with params:", params);

      // Use the search endpoint instead of the base products endpoint
      const response = await api.get("/api/products/search", { params });
      console.log("API response data:", response.data);

      // Check if the response contains products
      if (!response.data.products || response.data.products.length === 0) {
        console.log("API returned empty products array");
      }

      return response.data;
    } catch (error: unknown) {
      console.error("API request failed:", error);
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk<Product[], string>(
  "products/fetchRelatedProducts",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${productId}/related`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch related products"
      );
    }
  }
);

export const fetchFilterOptions = createAsyncThunk<FilterOptions>(
  "products/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products/filter-options");
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch filter options"
      );
    }
  }
);

// Renamed from submitReview to createProductReview to match import in ReviewSection
export const createProductReview = createAsyncThunk<
  Product,
  { productId: string; review: ProductReview }
>(
  "products/createProductReview",
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/products/${productId}/reviews`,
        review
      );
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

// New: Update product review
export const updateProductReview = createAsyncThunk<
  Product,
  { productId: string; reviewId: string; review: ProductReview }
>(
  "products/updateProductReview",
  async ({ productId, reviewId, review }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/products/${productId}/reviews/${reviewId}`,
        review
      );
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to update review"
      );
    }
  }
);

// Renamed from deleteReview to deleteProductReview to match import in ReviewSection
export const deleteProductReview = createAsyncThunk<
  Product,
  { productId: string; reviewId: string }
>(
  "products/deleteProductReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/products/${productId}/reviews/${reviewId}`
      );
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

const initialState: ProductsState = {
  products: [],
  product: null,
  relatedProducts: [],
  filterOptions: {
    flavors: [],
    shapes: [],
    layers: [],
    occasions: [],
    cakeTypes: [],
    eggTypes: [],
    priceRange: { min: 0, max: 5000 },
  },
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products || [];
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.currentPage || 1;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch related products
    builder.addCase(fetchRelatedProducts.fulfilled, (state, action) => {
      state.relatedProducts = action.payload;
    });

    // Fetch filter options
    builder.addCase(fetchFilterOptions.fulfilled, (state, action) => {
      state.filterOptions = action.payload;
    });

    // Create product review
    builder.addCase(createProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProductReview.fulfilled, (state, action) => {
      state.loading = false;
      if (state.product) {
        state.product = action.payload;
      }
    });
    builder.addCase(createProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update product review
    builder.addCase(updateProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProductReview.fulfilled, (state, action) => {
      state.loading = false;
      if (state.product) {
        state.product = action.payload;
      }
    });
    builder.addCase(updateProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete product review
    builder.addCase(deleteProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProductReview.fulfilled, (state, action) => {
      state.loading = false;
      if (state.product) {
        state.product = action.payload;
      }
    });
    builder.addCase(deleteProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default productSlice.reducer;

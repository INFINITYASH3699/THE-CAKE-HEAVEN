// src/services/productService.ts
import apiClient from '@/lib/api';
import { CategoryOption, Product } from "@/app/admin/products/page";


export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/api/products', { params });
    return response.data;
  },
  
  // Get product by ID
  getProductById: async (id: string) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },
  
  // Get product categories
  getCategories: async () => {
    const response = await apiClient.get('/api/products/categories');
    return response.data;
  },
  
  // Get filter options
  getFilterOptions: async () => {
    const response = await apiClient.get('/api/products/filter-options');
    return response.data;
  },
  
  // Get related products
  getRelatedProducts: async (id: string) => {
    const response = await apiClient.get(`/api/products/${id}/related`);
    return response.data;
  },
};

interface ProductsResponse {
  products: Product[];
  totalPages: number;
  total: number;
}

interface ProductParams {
  page?: number;
  limit?: number;
  sort?: string;
  keyword?: string;
  mainCategory?: string;
  status?: string;
  // Add these new properties
  flavor?: string;
  shape?: string;
  occasion?: string;
  cakeType?: string;
  festival?: string;
  layer?: string;
  eggOrEggless?: string;
}

export async function fetchProducts(params: ProductParams): Promise<ProductsResponse> {
  try {
    const response = await apiClient.get("/api/products", { params });
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return {
        products: response.data,
        totalPages: 1,
        total: response.data.length
      };
    } else if (response.data && Array.isArray(response.data.products)) {
      return {
        products: response.data.products,
        totalPages: response.data.pages || 1,
        total: response.data.total || response.data.products.length
      };
    }
    
    throw new Error("Unexpected response format");
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  try {
    const response = await apiClient.get("/api/products/categories");
    
    if (response.data && response.data.mainCategories) {
      // If the API returns a structured response
      const mainCats = response.data.mainCategories || [];
      return mainCats.map((cat: string) => ({ value: cat, label: cat }));
    } else if (Array.isArray(response.data)) {
      // If the API returns a simple array
      return response.data.map((cat: string) => ({ value: cat, label: cat }));
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

// services/productService.js
export const deleteProduct = async (productId: string): Promise<any> => {
  try {
    // Use apiClient to make the request to your actual backend API
    const response = await apiClient.delete(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Updates a product's active status
 * @param productId - The ID of the product to update
 * @param isActive - The new active status (true/false)
 */
export const updateProductStatus = async (productId: string, isActive: boolean): Promise<any> => {
  try {
    const response = await fetch(`/api/products/${productId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};
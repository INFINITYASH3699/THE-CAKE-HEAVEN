// redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Define product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  weight: string;
  flavor: string;
  stock: number;
  [key: string]: unknown;
}

// Define customizations interface
interface Customizations {
  messageOnCake?: string;
  specialInstructions?: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customizations?: Customizations;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ 
      product: Product; 
      quantity: number; 
      customizations?: Customizations 
    }>) => {
      const { product, quantity, customizations } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === product._id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
        if (state.items[existingItemIndex].quantity > 10) {
          state.items[existingItemIndex].quantity = 10;
        }
        if (customizations) {
          state.items[existingItemIndex].customizations = customizations;
        }
      } else {
        // Add new item
        state.items.push({
          id: uuidv4(),
          product,
          quantity,
          customizations,
        });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity = quantity;
        saveCartToStorage(state.items);
      }
    },
    updateCartItemCustomization: (state, action: PayloadAction<{ 
      itemId: string; 
      customizations: Customizations 
    }>) => {
      const { itemId, customizations } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        state.items[itemIndex].customizations = customizations;
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  updateCartItemCustomization,
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
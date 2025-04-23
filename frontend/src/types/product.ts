// src/types/product.ts
export interface CustomizationOptions {
  allowMessageOnCake: boolean;
  allowCustomDesign: boolean;
  extraChargeForCustomization: string;
}

export interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  mainCategory: string;
  subCategory: string;
  stock: number;
  layer: string;
  weight: string;
  flavor: string;
  shape: string;
  occasion: string;
  festival: string;
  cakeType: string;
  eggOrEggless: string;
  featured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  customization?: CustomizationOptions;
  tags: string[];
  ingredients: string[];
  images: string[];
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | CustomizationOptions
    | undefined;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  mainCategory: string;
  subCategory?: string;
  flavor?: string;
  shape?: string;
  weight?: string; // This is actually optional in your interface
  isActive: boolean;
  stock: number;
  rating?: number;
  numReviews?: number;
  // Add other fields that your products have
  [key: string]: string | number | boolean | string[] | undefined;
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
  [key: string]: string[] | { min: number; max: number } | unknown;
}

// Add this to your product.ts file
export interface ProductParams {
  page?: number;
  limit?: number;
  sort?: string;
  keyword?: string;
  mainCategory?: string;
  subCategory?: string;
  status?: string;
  flavor?: string;
  shape?: string;
  occasion?: string;
  cakeType?: string;
  festival?: string;
  layer?: string;
  eggOrEggless?: string;
  minPrice?: number;
  maxPrice?: number;
  [key: string]: any;
}

// components/shop/category/ProductList.tsx
"use client";

import React from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/redux/slices/productSlice";


interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
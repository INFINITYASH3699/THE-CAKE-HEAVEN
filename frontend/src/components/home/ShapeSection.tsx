// components/home/ShapeSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";
import { FiLoader } from "react-icons/fi";
import { fetchProducts, productService } from "@/services/productService";
import { Product } from "@/types/product";

const ShapeSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shapes, setShapes] = useState<string[]>([]);
  const [selectedShape, setSelectedShape] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First, fetch all available shapes
  useEffect(() => {
    const getFilterOptions = async () => {
      try {
        const options = await productService.getFilterOptions();
        if (options && options.shapes && options.shapes.length > 0) {
          setShapes(options.shapes);

          // Prioritize common shapes
          const popularShapes = ["Circle", "Square", "Heart", "Rectangle"];
          const availableShape =
            popularShapes.find((sh) => options.shapes.includes(sh)) ||
            options.shapes[0];
          setSelectedShape(availableShape);
        }
      } catch (err) {
        console.error("Error fetching shape options:", err);
        setError("Failed to load shape options");
      }
    };

    getFilterOptions();
  }, []);

  // Then, fetch products based on selected shape
  useEffect(() => {
    const getProducts = async () => {
      if (!selectedShape) return;

      try {
        setLoading(true);
        setError(null);

        // Using your existing fetchProducts function with type assertion
        const params = {
          limit: 8,
          sort: "newest",
          shape: selectedShape,
        };

        const response = await fetchProducts(params as any);

        if (response && response.products) {
          // Use type assertion to overcome type incompatibility
          setProducts(response.products as unknown as Product[]);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [selectedShape]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <FiLoader className="w-8 h-8 mx-auto animate-spin text-pink-500" />
        <p className="mt-2 text-gray-600">Loading {selectedShape} cakes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (products.length === 0 || !selectedShape) {
    return null;
  }

  return (
    <ProductSection
      title={`${selectedShape} Cakes`}
      products={products}
      viewAllLink={`/shop/category/shape/${selectedShape.toLowerCase()}`}
      useCarousel={products.length > 4}
    />
  );
};

export default ShapeSection;

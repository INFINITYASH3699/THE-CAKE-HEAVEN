// components/home/FlavorSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";
import { FiLoader } from "react-icons/fi";
import { fetchProducts, productService } from "@/services/productService";
import { Product } from "@/types/product";

const FlavorSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First, fetch all available flavors
  useEffect(() => {
    const getFilterOptions = async () => {
      try {
        const options = await productService.getFilterOptions();
        if (options && options.flavors && options.flavors.length > 0) {
          setFlavors(options.flavors);

          // Prioritize popular flavors
          const popularFlavors = [
            "Chocolate",
            "Vanilla",
            "Butterscotch",
            "Red Velvet",
          ];
          const availableFlavor =
            popularFlavors.find((fl) => options.flavors.includes(fl)) ||
            options.flavors[0];
          setSelectedFlavor(availableFlavor);
        }
      } catch (err) {
        console.error("Error fetching flavor options:", err);
        setError("Failed to load flavor options");
      }
    };

    getFilterOptions();
  }, []);

  // Then, fetch products based on selected flavor
  useEffect(() => {
    const getProducts = async () => {
      if (!selectedFlavor) return;

      try {
        setLoading(true);
        setError(null);

        // Using your existing fetchProducts function with type assertion
        const params = {
          limit: 8,
          sort: "newest",
          flavor: selectedFlavor,
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
  }, [selectedFlavor]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <FiLoader className="w-8 h-8 mx-auto animate-spin text-pink-500" />
        <p className="mt-2 text-gray-600">Loading {selectedFlavor} cakes...</p>
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

  if (products.length === 0 || !selectedFlavor) {
    return null;
  }

  return (
    <ProductSection
      title={`${selectedFlavor} Cakes`}
      products={products}
      viewAllLink={`/shop/category/flavor/${selectedFlavor.toLowerCase()}`}
      useCarousel={products.length > 4}
    />
  );
};

export default FlavorSection;

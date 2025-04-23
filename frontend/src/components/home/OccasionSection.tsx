// components/home/OccasionSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";
import { FiLoader } from "react-icons/fi";
import { fetchProducts, productService } from "@/services/productService";
import { Product } from "@/types/product";

const OccasionSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First, fetch all available occasions
  useEffect(() => {
    const getFilterOptions = async () => {
      try {
        const options = await productService.getFilterOptions();
        if (options && options.occasions && options.occasions.length > 0) {
          setOccasions(options.occasions);

          // Prioritize popular occasions
          const popularOccasions = [
            "Birthday",
            "Wedding",
            "Anniversary",
            "Baby Shower",
          ];
          const availableOccasion =
            popularOccasions.find((occ) => options.occasions.includes(occ)) ||
            options.occasions[0];
          setSelectedOccasion(availableOccasion);
        }
      } catch (err) {
        console.error("Error fetching occasion options:", err);
        setError("Failed to load occasion options");
      }
    };

    getFilterOptions();
  }, []);

  // Then, fetch products based on selected occasion
  useEffect(() => {
    const getProducts = async () => {
      if (!selectedOccasion) return;

      try {
        setLoading(true);
        setError(null);

        // Using your existing fetchProducts function with type assertion
        const params = {
          limit: 8,
          sort: "newest",
          occasion: selectedOccasion,
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
  }, [selectedOccasion]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <FiLoader className="w-8 h-8 mx-auto animate-spin text-pink-500" />
        <p className="mt-2 text-gray-600">
          Loading {selectedOccasion} cakes...
        </p>
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

  if (products.length === 0 || !selectedOccasion) {
    return null;
  }

  return (
    <ProductSection
      title={`${selectedOccasion} Cakes`}
      products={products}
      viewAllLink={`/shop/category/occasion/${selectedOccasion.toLowerCase()}`}
      useCarousel={products.length > 4}
    />
  );
};

export default OccasionSection;

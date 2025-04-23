// components/home/CakeTypeSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import ProductSection from "./ProductSection";
import { FiLoader } from "react-icons/fi";
import { fetchProducts, productService } from "@/services/productService";
import { Product } from "@/types/product";

const CakeTypeSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cakeTypes, setCakeTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First, fetch all available cake types
  useEffect(() => {
    const getFilterOptions = async () => {
      try {
        const options = await productService.getFilterOptions();
        if (options && options.cakeTypes) {
          // Add Regular type if it's not in the list
          const allTypes = ["Regular", ...(options.cakeTypes || [])];
          setCakeTypes([...new Set(allTypes)]);

          // Prioritize common types
          const popularTypes = ["Premium", "Regular", "Mousse", "Cheesecake"];
          const availableType =
            popularTypes.find((type) => allTypes.includes(type)) || allTypes[0];
          setSelectedType(availableType);
        }
      } catch (err) {
        console.error("Error fetching cake type options:", err);
        setError("Failed to load cake type options");
      }
    };

    getFilterOptions();
  }, []);

  // Then, fetch products based on selected cake type
  useEffect(() => {
    const getProducts = async () => {
      if (!selectedType) return;

      try {
        setLoading(true);
        setError(null);

        // Using your existing fetchProducts function with type assertion
        const params = {
          limit: 8,
          sort: "newest",
          cakeType: selectedType,
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
  }, [selectedType]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <FiLoader className="w-8 h-8 mx-auto animate-spin text-pink-500" />
        <p className="mt-2 text-gray-600">Loading {selectedType} cakes...</p>
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

  if (products.length === 0 || !selectedType) {
    return null;
  }

  return (
    <ProductSection
      title={`${selectedType} Cakes`}
      products={products}
      viewAllLink={`/shop/category/type/${selectedType.toLowerCase()}`}
      useCarousel={products.length > 4}
    />
  );
};

export default CakeTypeSection;

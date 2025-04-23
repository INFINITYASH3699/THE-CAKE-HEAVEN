// src/app/shop/search/SearchResultsContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProducts } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import { FiLoader } from "react-icons/fi";
import { Product } from "@/types/product";

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        if (query) {
          const response = await fetchProducts({
            keyword: query,
            limit: 20,
          });

          if (response && response.products) {
            setProducts(response.products as unknown as Product[]);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error searching products:", err);
        setError("Failed to search products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <FiLoader className="w-8 h-8 mx-auto animate-spin text-pink-500" />
        <p className="mt-4 text-gray-600">Searching for "{query}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found for "{query}"</p>
          <p className="mt-2 text-gray-500">
            Try a different search term or browse our categories.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">
            Found {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product as any} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

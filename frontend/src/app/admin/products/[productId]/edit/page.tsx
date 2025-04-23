// app/admin/products/[productId]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import Notification from "@/components/ui/Notification";
import EditProductForm from "@/components/admin/products/EditProductForm";
// Import the shared ProductData interface
import { ProductData } from "@/types/product";

// Define an error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { productId } = params;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/products/${productId}`);

        // Transform API response to ensure it matches ProductData interface
        const apiProduct = response.data;
        const productData: ProductData = {
          _id: apiProduct._id,
          name: apiProduct.name || "",
          description: apiProduct.description || "",
          price: apiProduct.price || 0,
          discountPrice: apiProduct.discountPrice,
          mainCategory: apiProduct.mainCategory || "Cakes",
          subCategory: apiProduct.subCategory || "Regular",
          stock: apiProduct.stock || 0,
          layer: apiProduct.layer || "One",
          weight: apiProduct.weight || "",
          flavor: apiProduct.flavor || "Chocolate",
          shape: apiProduct.shape || "Circle",
          occasion: apiProduct.occasion || "Birthday",
          festival: apiProduct.festival || "None",
          cakeType: apiProduct.cakeType || "Regular",
          eggOrEggless: apiProduct.eggOrEggless || "Eggless",
          featured: apiProduct.featured || false,
          isBestSeller: apiProduct.isBestSeller || false,
          isNew: apiProduct.isNew || false,
          isActive: apiProduct.isActive !== false, // Default true
          customization: {
            allowMessageOnCake:
              apiProduct.customization?.allowMessageOnCake ?? true,
            allowCustomDesign:
              apiProduct.customization?.allowCustomDesign ?? false,
            extraChargeForCustomization:
              apiProduct.customization?.extraChargeForCustomization || "0",
          },
          tags: apiProduct.tags || [],
          ingredients: apiProduct.ingredients || [],
          images: apiProduct.images || [],
        };

        setProduct(productData);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching product:", err);

        // Properly type the error
        const apiError = err as ApiError;

        setError(
          apiError.response?.data?.message ||
            (err instanceof Error
              ? err.message
              : "Failed to load product. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSuccess = () => {
    setNotification({
      type: "success",
      message: "Product updated successfully!",
    });

    // Redirect after a delay
    setTimeout(() => {
      router.push("/admin/products");
    }, 2000);
  };

  const handleError = (message: string) => {
    setNotification({
      type: "error",
      message,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin h-8 w-8 text-pink-500" />
        <span className="ml-2 text-gray-600">Loading product...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <Link
                href="/admin/products"
                className="text-sm font-medium text-red-700 hover:text-red-600"
              >
                ← Back to products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center mb-6">
        <Link
          href="/admin/products"
          className="mr-4 text-gray-500 hover:text-gray-700 flex items-center"
        >
          <FiArrowLeft className="mr-1" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Product: {product?.name}
        </h1>
      </div>

      {notification.type && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: null, message: "" })}
        />
      )}

      {product && (
        <EditProductForm
          product={product}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
}

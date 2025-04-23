// components/admin/products/CreateProductForm.tsx
"use client";

import { useState } from "react";
import FormStepper from "./FormStepper";
import BasicInfoForm from "./BasicInfoForm";
import ProductSpecifications from "./ProductSpecifications";
import ImageManager from "./ImageManager";
import PricingForm from "./PricingForm";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

interface CustomizationOptions {
  allowMessageOnCake: boolean;
  allowCustomDesign: boolean;
  extraChargeForCustomization: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  mainCategory: string;
  subCategory: string;
  stock: string;
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
  customization: CustomizationOptions;
  tags: string[];
  ingredients: string[];
  [key: string]: string | boolean | string[] | CustomizationOptions;
}

interface CreateProductFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

// Updated interface for API error handling with correct types
interface ApiError extends Error {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Array<{ msg: string }>;
    };
  };
}

export default function CreateProductForm({
  onSuccess,
  onError,
}: CreateProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Form state with proper type
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    mainCategory: "Cakes",
    subCategory: "Regular",
    stock: "10",
    layer: "One",
    weight: "",
    flavor: "Chocolate",
    shape: "Circle",
    occasion: "Birthday",
    festival: "None",
    cakeType: "Regular",
    eggOrEggless: "Eggless",
    featured: false,
    isBestSeller: false,
    isNew: true,
    isActive: true,
    customization: {
      allowMessageOnCake: true,
      allowCustomDesign: false,
      extraChargeForCustomization: "0",
    },
    tags: [],
    ingredients: [],
  });

  // Image state
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const handleChange = (field: string, value: string | boolean | string[]) => {
    // Handle nested fields like customization.allowMessageOnCake
    if (field.includes(".")) {
      const [parent, child] = field.split(".");

      if (parent === "customization") {
        setFormData({
          ...formData,
          customization: {
            ...formData.customization,
            [child]: value,
          },
        });
      } else {
        // Handle other nested objects if needed
        console.warn(`Unexpected nested field: ${field}`);
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.name.trim()) {
          onError("Product name is required");
          return false;
        }
        if (!formData.description.trim() || formData.description.length < 20) {
          onError("Description must be at least 20 characters");
          return false;
        }
        if (!formData.weight.trim()) {
          onError("Weight is required");
          return false;
        }
        return true;

      case 2: // Specifications
        // All fields have defaults, so we're good
        return true;

      case 3: // Images
        if (images.length === 0 && imageUrls.length === 0) {
          onError("At least one product image is required");
          return false;
        }
        return true;

      case 4: // Pricing
        if (
          !formData.price ||
          isNaN(parseFloat(formData.price)) ||
          parseFloat(formData.price) <= 0
        ) {
          onError("Valid price is required");
          return false;
        }
        if (
          formData.discountPrice &&
          (isNaN(parseFloat(formData.discountPrice)) ||
            parseFloat(formData.discountPrice) <= 0 ||
            parseFloat(formData.discountPrice) >= parseFloat(formData.price))
        ) {
          onError("Discount price must be less than regular price");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Modified handleSubmit function in CreateProductForm.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    try {
      setLoading(true);

      // Create FormData object
      const productFormData = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "customization" ||
          key === "tags" ||
          key === "ingredients"
        ) {
          productFormData.append(key, JSON.stringify(value));
        } else {
          productFormData.append(key, String(value));
        }
      });

      // Add category field for backward compatibility
      productFormData.append("category", formData.mainCategory);

      // Check if we have any images (either files or URLs)
      if (images.length === 0 && imageUrls.length === 0) {
        toast.error("At least one product image is required");
        setLoading(false);
        return;
      }

      // Add local images (files) if present
      if (images.length > 0) {
        images.forEach((image) => {
          productFormData.append("images", image);
        });
      }

      // Add image URLs as a properly formatted JSON string
      if (imageUrls.length > 0) {
        // This is crucial - ensure it matches what the backend expects
        productFormData.append("imageUrls", JSON.stringify(imageUrls));
      }

      // Debug FormData
      for (let pair of productFormData.entries()) {
      }

      // Send the request
      try {
        const response = await apiClient.post(
          "/api/products",
          productFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Product created successfully!");
        onSuccess();
      } catch (error) {
        console.error("API error:", error);
        const apiError = error as ApiError;

        if (apiError.response?.data?.message) {
          onError(apiError.response.data.message);
        } else {
          onError("Failed to create product. Please try again.");
        }
      }
    } catch (err: unknown) {
      console.error("Error creating product:", err);
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {useMockData && (
        <div className="bg-amber-50 text-amber-700 text-sm px-6 py-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Running in demo mode - changes will not persist
        </div>
      )}

      <FormStepper currentStep={currentStep} onStepClick={setCurrentStep} />

      <form onSubmit={handleSubmit} className="p-6">
        {currentStep === 1 && (
          <BasicInfoForm formData={formData} onChange={handleChange} />
        )}

        {currentStep === 2 && (
          <ProductSpecifications formData={formData} onChange={handleChange} />
        )}

        {currentStep === 3 && (
          <ImageManager
            existingImages={imageUrls}
            newImages={images}
            onChange={(existingImages, newImages, deletedImages) => {
              setImageUrls(existingImages);
              setImages(newImages);
              setDeletedImageUrls(deletedImages);
            }}
          />
        )}

        {currentStep === 4 && (
          <PricingForm formData={formData} onChange={handleChange} />
        )}

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// components/admin/products/EditProductForm.tsx
"use client";

import { useState } from "react";
import FormStepper from "./FormStepper";
import BasicInfoForm from "./BasicInfoForm";
import ProductSpecifications from "./ProductSpecifications";
import ImageManager from "./ImageManager";
import PricingForm from "./PricingForm";
import apiClient from "@/lib/api";
// Import shared types
import { ProductData, CustomizationOptions } from "@/types/product";

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

interface EditProductFormProps {
  product: ProductData;
  onSuccess: () => void;
  onError: (message: string) => void;
}

// Define an API error interface for better error handling
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      errors?: Array<{ msg: string }>;
    };
  };
}

export default function EditProductForm({
  product,
  onSuccess,
  onError,
}: EditProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Initialize form data from product with proper types
  const [formData, setFormData] = useState<ProductFormData>({
    name: product.name || "",
    description: product.description || "",
    price: product.price?.toString() || "",
    discountPrice: product.discountPrice?.toString() || "",
    mainCategory: product.mainCategory || "Cakes",
    subCategory: product.subCategory || "Regular",
    stock: product.stock?.toString() || "10",
    layer: product.layer || "One",
    weight: product.weight || "",
    flavor: product.flavor || "Chocolate",
    shape: product.shape || "Circle",
    occasion: product.occasion || "Birthday",
    festival: product.festival || "None",
    cakeType: product.cakeType || "Regular",
    eggOrEggless: product.eggOrEggless || "Eggless",
    featured: product.featured || false,
    isBestSeller: product.isBestSeller || false,
    isNew: product.isNew || true,
    isActive: product.isActive !== false, // Default to true if not specified
    customization: {
      allowMessageOnCake: product.customization?.allowMessageOnCake ?? true,
      allowCustomDesign: product.customization?.allowCustomDesign ?? false,
      extraChargeForCustomization:
        product.customization?.extraChargeForCustomization?.toString() || "0",
    },
    tags: product.tags || [],
    ingredients: product.ingredients || [],
  });

  // Image state
  const [existingImages, setExistingImages] = useState<string[]>(
    product.images || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

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
        // Handle other potential nested objects
        console.warn(`Unexpected nested field: ${field}`);
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleImagesChange = (
    updatedExistingImages: string[],
    updatedNewImages: File[],
    deletedImages: string[]
  ) => {
    setExistingImages(updatedExistingImages);
    setNewImages(updatedNewImages);
    setImagesToDelete((prev) => [...prev, ...deletedImages]);
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
        if (existingImages.length === 0 && newImages.length === 0) {
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

  // Updated handleNext function to prevent form submission
  const handleNext = (e: React.MouseEvent) => {
    // Explicitly prevent any default behavior
    e.preventDefault();

    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    // Explicitly prevent any default behavior
    e.preventDefault();

    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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
        if (key === "customization") {
          productFormData.append(key, JSON.stringify(value));
        } else if (key === "tags" || key === "ingredients") {
          productFormData.append(key, JSON.stringify(value));
        } else {
          productFormData.append(key, String(value));
        }
      });

      // Add category field for backward compatibility
      productFormData.append("category", formData.mainCategory);

      // Add existing images (that weren't deleted)
      productFormData.append("existingImages", JSON.stringify(existingImages));

      // Add images to delete
      if (imagesToDelete.length > 0) {
        productFormData.append(
          "imagesToDelete",
          JSON.stringify(imagesToDelete)
        );
      }

      // Add new images
      newImages.forEach((image) => {
        productFormData.append("images", image);
      });

      // Send request to update the product
      const response = await apiClient.put(
        `/api/products/${product._id}`,
        productFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product updated:", response.data);
      onSuccess();
    } catch (err: unknown) {
      console.error("Error updating product:", err);

      // Handle errors
      const error = err as ApiError;
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const errorMsgs = error.response.data.errors.map((e) => e.msg);
        onError(`Validation errors: ${errorMsgs.join(", ")}`);
      } else {
        onError(
          error.response?.data?.message ||
            (error instanceof Error
              ? error.message
              : "Failed to update product")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <FormStepper currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Only allow form submission on the final step */}
      <form
        onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()}
        className="p-6"
      >
        {currentStep === 1 && (
          <BasicInfoForm formData={formData} onChange={handleChange} />
        )}

        {currentStep === 2 && (
          <ProductSpecifications formData={formData} onChange={handleChange} />
        )}

        {currentStep === 3 && (
          <ImageManager
            existingImages={existingImages}
            newImages={newImages}
            onChange={handleImagesChange}
            isEditMode={true}
          />
        )}

        {currentStep === 4 && (
          <PricingForm formData={formData} onChange={handleChange} />
        )}

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
          {currentStep > 1 ? (
            <button
              type="button" // Explicitly set to button type
              onClick={(e) => handlePrevious(e)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button" // Explicitly set to button type
              onClick={(e) => handleNext(e)}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit" // This is the only submit button
              disabled={loading}
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

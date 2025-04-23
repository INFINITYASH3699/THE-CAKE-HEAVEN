// components/admin/coupons/CouponForm.tsx (updated with proper types)
"use client";

import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchProducts } from "@/services/productService";
import { useRouter } from "next/navigation";

// Define proper types for the form data
interface CouponFormData {
  code: string;
  description: string;
  discountType: string;
  discountAmount: string;
  minimumPurchase: string;
  maximumDiscount: string;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableTo: string;
  applicableProducts: string[];
  applicableCategories: string[];
  applicableUsers: string[];
  usageLimit: string;
  perUserLimit: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  [key: string]: any;
}

interface CouponFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  submitText: string;
  isEditing?: boolean;
}

const CouponForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitText,
  isEditing = false,
}: CouponFormProps) => {
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    discountType: "percentage",
    discountAmount: "",
    minimumPurchase: "",
    maximumDiscount: "",
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
    applicableTo: "all",
    applicableProducts: [],
    applicableCategories: [],
    applicableUsers: [],
    usageLimit: "",
    perUserLimit: "",
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const router = useRouter();

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        description: initialData.description || "",
        discountType: initialData.discountType || "percentage",
        discountAmount: initialData.discountAmount?.toString() || "",
        minimumPurchase: initialData.minimumPurchase?.toString() || "",
        maximumDiscount: initialData.maximumDiscount?.toString() || "",
        validFrom: new Date(initialData.validFrom) || new Date(),
        validUntil:
          new Date(initialData.validUntil) ||
          new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
        applicableTo: initialData.applicableTo || "all",
        applicableProducts: initialData.applicableProducts || [],
        applicableCategories: initialData.applicableCategories || [],
        applicableUsers: initialData.applicableUsers || [],
        usageLimit: initialData.usageLimit?.toString() || "",
        perUserLimit: initialData.perUserLimit?.toString() || "",
      });
    }
  }, [initialData]);

  // Fetch products if necessary
  useEffect(() => {
    if (formData.applicableTo === "product") {
      const loadProducts = async () => {
        try {
          setLoadingProducts(true);
          const result = await fetchProducts({ limit: 100 });
          setAvailableProducts(result.products);
        } catch (err) {
          console.error("Error loading products:", err);
        } finally {
          setLoadingProducts(false);
        }
      };

      loadProducts();
    }
  }, [formData.applicableTo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error for this field when user edits it
    if (errors[name]) {
      // Now this is type-safe
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string | undefined> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.discountAmount.trim()) {
      newErrors.discountAmount = "Discount amount is required";
    } else if (
      formData.discountType === "percentage" &&
      (parseFloat(formData.discountAmount) <= 0 ||
        parseFloat(formData.discountAmount) > 100)
    ) {
      newErrors.discountAmount =
        "Percentage discount must be between 0 and 100";
    } else if (
      formData.discountType === "fixed" &&
      parseFloat(formData.discountAmount) <= 0
    ) {
      newErrors.discountAmount = "Fixed discount must be greater than 0";
    }

    if (formData.validFrom >= formData.validUntil) {
      newErrors.validUntil = "End date must be after start date";
    }

    // If there are validation errors, show them and stop submission
    if (Object.values(newErrors).some((error) => error !== undefined)) {
      setErrors(newErrors);
      return;
    }

    // Format the data for submission
    const submissionData = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      discountAmount: parseFloat(formData.discountAmount),
      minimumPurchase: formData.minimumPurchase
        ? parseFloat(formData.minimumPurchase)
        : 0,
      maximumDiscount: formData.maximumDiscount
        ? parseFloat(formData.maximumDiscount)
        : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      perUserLimit: formData.perUserLimit
        ? parseInt(formData.perUserLimit)
        : null,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coupon Code */}
        <div className="col-span-1">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            Coupon Code*
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="code"
              id="code"
              value={formData.code}
              onChange={handleChange}
              disabled={isEditing} // Cannot change code when editing
              placeholder="e.g. SUMMER25"
              className={`shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                isEditing ? "bg-gray-100" : ""
              }`}
            />
            {isEditing && (
              <p className="mt-1 text-xs text-gray-500">
                Coupon code cannot be changed after creation
              </p>
            )}
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
          </div>
        </div>

        {/* Discount Type */}
        <div className="col-span-1">
          <label
            htmlFor="discountType"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Type*
          </label>
          <div className="mt-1">
            <select
              name="discountType"
              id="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description*
          </label>
          <div className="mt-1">
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the coupon"
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Discount Amount */}
        <div className="col-span-1">
          <label
            htmlFor="discountAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Amount*
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {formData.discountType === "percentage" ? (
                <span className="text-gray-500 sm:text-sm">%</span>
              ) : (
                <span className="text-gray-500 sm:text-sm">$</span>
              )}
            </div>
            <input
              type="number"
              name="discountAmount"
              id="discountAmount"
              min={0}
              max={formData.discountType === "percentage" ? 100 : undefined}
              step={0.01}
              value={formData.discountAmount}
              onChange={handleChange}
              className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          {errors.discountAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.discountAmount}</p>
          )}
        </div>

        {/* Minimum Purchase */}
        <div className="col-span-1">
          <label
            htmlFor="minimumPurchase"
            className="block text-sm font-medium text-gray-700"
          >
            Minimum Purchase
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="minimumPurchase"
              id="minimumPurchase"
              min={0}
              step={0.01}
              value={formData.minimumPurchase}
              onChange={handleChange}
              placeholder="0.00"
              className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Leave empty for no minimum purchase requirement
          </p>
        </div>

        {/* Maximum Discount (for percentage discount) */}
        {formData.discountType === "percentage" && (
          <div className="col-span-1">
            <label
              htmlFor="maximumDiscount"
              className="block text-sm font-medium text-gray-700"
            >
              Maximum Discount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="maximumDiscount"
                id="maximumDiscount"
                min={0}
                step={0.01}
                value={formData.maximumDiscount}
                onChange={handleChange}
                placeholder="0.00"
                className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for no maximum discount limit
            </p>
          </div>
        )}

        {/* Valid From */}
        <div className="col-span-1">
          <label
            htmlFor="validFrom"
            className="block text-sm font-medium text-gray-700"
          >
            Valid From*
          </label>
          <div className="mt-1">
            <DatePicker
              selected={formData.validFrom}
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData((prev) => ({ ...prev, validFrom: date }));
                }
              }}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Valid Until */}
        <div className="col-span-1">
          <label
            htmlFor="validUntil"
            className="block text-sm font-medium text-gray-700"
          >
            Valid Until*
          </label>
          <div className="mt-1">
            <DatePicker
              selected={formData.validUntil}
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData((prev) => ({ ...prev, validUntil: date }));
                }
              }}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
              minDate={new Date()}
            />
            {errors.validUntil && (
              <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>
            )}
          </div>
        </div>

        {/* Applicable To */}
        <div className="col-span-1">
          <label
            htmlFor="applicableTo"
            className="block text-sm font-medium text-gray-700"
          >
            Applicable To
          </label>
          <div className="mt-1">
            <select
              name="applicableTo"
              id="applicableTo"
              value={formData.applicableTo}
              onChange={handleChange}
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="all">All Products</option>
              <option value="category">Specific Categories</option>
              <option value="product">Specific Products</option>
              <option value="user">Specific Users</option>
            </select>
          </div>
        </div>

        {/* Active Status */}
        <div className="col-span-1">
          <div className="flex items-center h-full mt-5">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700"
            >
              Active
            </label>
          </div>
        </div>

        {/* Usage Limit */}
        <div className="col-span-1">
          <label
            htmlFor="usageLimit"
            className="block text-sm font-medium text-gray-700"
          >
            Usage Limit
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="usageLimit"
              id="usageLimit"
              min={0}
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <p className="mt-1 text-xs text-gray-500">
              Total number of times this coupon can be used
            </p>
          </div>
        </div>

        {/* Per User Limit */}
        <div className="col-span-1">
          <label
            htmlFor="perUserLimit"
            className="block text-sm font-medium text-gray-700"
          >
            Per User Limit
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="perUserLimit"
              id="perUserLimit"
              min={0}
              value={formData.perUserLimit}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of times each user can use this coupon
            </p>
          </div>
        </div>

        {/* Applicable Products Selection (if applicable) */}
        {formData.applicableTo === "product" && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Applicable Products
            </label>
            {loadingProducts ? (
              <div className="py-4 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-pink-500 border-r-transparent"></div>
                <span className="ml-2">Loading products...</span>
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="text-gray-500 text-sm py-2">
                No products available
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                {availableProducts.map((product) => (
                  <div key={product._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`product-${product._id}`}
                      checked={formData.applicableProducts.includes(
                        product._id
                      )}
                      onChange={(e) => {
                        const updatedProducts = e.target.checked
                          ? [...formData.applicableProducts, product._id]
                          : formData.applicableProducts.filter(
                              (id) => id !== product._id
                            );

                        setFormData((prev) => ({
                          ...prev,
                          applicableProducts: updatedProducts,
                        }));
                      }}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`product-${product._id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {product.name} (${product.price.toFixed(2)})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applicable Categories Selection (if applicable) */}
        {formData.applicableTo === "category" && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Applicable Categories
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Birthday Cake",
                "Celebration Cake",
                "Cup Cake",
                "Pastries",
                "Cookies",
                "Brownies",
              ].map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={formData.applicableCategories.includes(category)}
                    onChange={(e) => {
                      const updatedCategories = e.target.checked
                        ? [...formData.applicableCategories, category]
                        : formData.applicableCategories.filter(
                            (cat) => cat !== category
                          );

                      setFormData((prev) => ({
                        ...prev,
                        applicableCategories: updatedCategories,
                      }));
                    }}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push("/admin/coupons")}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
              Processing...
            </>
          ) : (
            <>
              <FiSave className="mr-2 h-4 w-4" />
              {submitText}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;

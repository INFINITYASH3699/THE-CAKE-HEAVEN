// components/admin/products/PricingForm.tsx
interface CustomizationOptions {
  allowMessageOnCake: boolean;
  allowCustomDesign: boolean;
  extraChargeForCustomization: string;
}

interface FormData {
  price: string;
  discountPrice: string;
  stock: string;
  [key: string]: string | boolean | string[] | CustomizationOptions;
}

interface PricingFormProps {
  formData: FormData;
  onChange: (field: string, value: string | boolean) => void;
}

export default function PricingForm({ formData, onChange }: PricingFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Pricing Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Regular Price (₹) *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={(e) => onChange("price", e.target.value)}
              min="0"
              step="0.01"
              className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            The regular selling price
          </p>
        </div>

        <div>
          <label
            htmlFor="discountPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Discount Price (₹)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              id="discountPrice"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={(e) => onChange("discountPrice", e.target.value)}
              min="0"
              step="0.01"
              className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Optional. Must be less than regular price.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Stock Quantity *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={(e) => onChange("stock", e.target.value)}
            min="0"
            className="focus:ring-pink-500 focus:border-pink-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="10"
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Number of items available for sale
        </p>
      </div>

      {formData.price &&
        formData.discountPrice &&
        parseFloat(formData.discountPrice) < parseFloat(formData.price) && (
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-green-800 mb-2">
              Price Summary
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Regular Price:</p>
                <p className="text-lg font-medium">
                  ₹{parseFloat(formData.price).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Discount Price:</p>
                <p className="text-lg font-medium text-green-700">
                  ₹{parseFloat(formData.discountPrice).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">You Save:</p>
                <p className="text-lg font-medium text-red-600">
                  ₹
                  {(
                    parseFloat(formData.price) -
                    parseFloat(formData.discountPrice)
                  ).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Discount Percentage:</p>
                <p className="text-lg font-medium text-indigo-600">
                  {Math.round(
                    (1 -
                      parseFloat(formData.discountPrice) /
                        parseFloat(formData.price)) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

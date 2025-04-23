// components/admin/products/BasicInfoForm.tsx
interface FormData {
  name: string;
  weight: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  [key: string]: string | boolean | string[] | object; // For other possible properties
}

interface BasicInfoFormProps {
  formData: FormData;
  onChange: (field: string, value: string | boolean) => void;
}
export default function BasicInfoForm({
  formData,
  onChange,
}: BasicInfoFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            placeholder="e.g., Chocolate Truffle Cake"
            required
          />
        </div>

        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Weight *
          </label>
          <input
            type="text"
            id="weight"
            value={formData.weight}
            onChange={(e) => onChange("weight", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            placeholder="e.g., 500g, 1kg"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *{" "}
          <span className="text-gray-500 text-xs">(minimum 20 characters)</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={5}
          className={`w-full px-4 py-2 border ${
            formData.description.length > 0 && formData.description.length < 20
              ? "border-red-300"
              : "border-gray-300"
          } rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500`}
          placeholder="Provide a detailed description of your product (minimum 20 characters)..."
          required
        />
        {formData.description.length > 0 && formData.description.length < 20 ? (
          <p className="mt-1 text-sm text-red-600">
            Description must be at least 20 characters (
            {20 - formData.description.length} more needed)
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length} /{" "}
            {Math.max(20, formData.description.length)} characters
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="mainCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Main Category *
          </label>
          <select
            id="mainCategory"
            value={formData.mainCategory}
            onChange={(e) => onChange("mainCategory", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            required
          >
            <option value="Cakes">Cakes</option>
            <option value="Cup-Cakes">Cup-Cakes</option>
            <option value="Pastry">Pastry</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="subCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sub Category
          </label>
          <select
            id="subCategory"
            value={formData.subCategory}
            onChange={(e) => onChange("subCategory", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="Regular">Regular</option>
            <option value="Trending Cakes">Trending Cakes</option>
            <option value="Unique Cakes">Unique Cakes</option>
            <option value="Featured Cakes">Featured Cakes</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// components/admin/products/ProductSpecifications.tsx
import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

// Define proper types
interface CustomizationOptions {
  allowMessageOnCake: boolean;
  allowCustomDesign: boolean;
  extraChargeForCustomization: string;
}

interface FormData {
  flavor: string;
  shape: string;
  layer: string;
  occasion: string;
  festival: string;
  cakeType: string;
  eggOrEggless: string;
  customization: CustomizationOptions;
  ingredients: string[];
  tags: string[];
  featured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  [key: string]: string | boolean | string[] | CustomizationOptions;
}

interface ProductSpecificationsProps {
  formData: FormData;
  onChange: (field: string, value: string | boolean | string[]) => void;
}

export default function ProductSpecifications({
  formData,
  onChange,
}: ProductSpecificationsProps) {
  const [newIngredient, setNewIngredient] = useState("");
  const [newTag, setNewTag] = useState("");

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const updatedIngredients = [
        ...formData.ingredients,
        newIngredient.trim(),
      ];
      onChange("ingredients", updatedIngredients);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients.filter(
      (_, i: number) => i !== index
    );
    onChange("ingredients", updatedIngredients);
  };

  const addTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...formData.tags, newTag.trim()];
      onChange("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = formData.tags.filter((_, i: number) => i !== index);
    onChange("tags", updatedTags);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Product Specifications
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="flavor"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Flavor *
          </label>
          <select
            id="flavor"
            value={formData.flavor}
            onChange={(e) => onChange("flavor", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            required
          >
            <option value="Chocolate">Chocolate</option>
            <option value="Blueberry">Blueberry</option>
            <option value="Pineapple">Pineapple</option>
            <option value="Fresh Fruit">Fresh Fruit</option>
            <option value="Red Velvet">Red Velvet</option>
            <option value="Vanilla">Vanilla</option>
            <option value="Butterscotch">Butterscotch</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="shape"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Shape *
          </label>
          <select
            id="shape"
            value={formData.shape}
            onChange={(e) => onChange("shape", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            required
          >
            <option value="Square">Square</option>
            <option value="Circle">Circle</option>
            <option value="Heart">Heart</option>
            <option value="Tall">Tall</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="layer"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Layer *
          </label>
          <select
            id="layer"
            value={formData.layer}
            onChange={(e) => onChange("layer", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            required
          >
            <option value="One">One</option>
            <option value="Two">Two</option>
            <option value="Three">Three</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="occasion"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Occasion *
          </label>
          <select
            id="occasion"
            value={formData.occasion}
            onChange={(e) => onChange("occasion", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            required
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Wedding">Wedding</option>
            <option value="Baby Shower">Baby Shower</option>
            <option value="Engagement">Engagement</option>
            <option value="Mother's Day">Mother&apos;s Day</option>
            <option value="Father's Day">Father&apos;s Day</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="festival"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Festival
          </label>
          <select
            id="festival"
            value={formData.festival}
            onChange={(e) => onChange("festival", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="None">None</option>
            <option value="Valentine's Day">Valentine&apos;s Day</option>
            <option value="Christmas">Christmas</option>
            <option value="Friendship's Day">Friendship&apos;s Day</option>
            <option value="Teacher's Day">Teacher&apos;s Day</option>
            <option value="New Year">New Year</option>
            <option value="Farewell Cakes">Farewell Cakes</option>
            <option value="Classic Cakes">Classic Cakes</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="cakeType"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Cake Type
        </label>
        <select
          id="cakeType"
          value={formData.cakeType}
          onChange={(e) => onChange("cakeType", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="Regular">Regular</option>
          <option value="Pull Me Up Cake">Pull Me Up Cake</option>
          <option value="Pinata Cake">Pinata Cake</option>
          <option value="Half Cake">Half Cake</option>
          <option value="Bomb Cake">Bomb Cake</option>
          <option value="Bento Cake">Bento Cake</option>
          <option value="Surprise Cake Box">Surprise Cake Box</option>
          <option value="Photo Pulling Cake">Photo Pulling Cake</option>
          <option value="Mousse">Mousse</option>
        </select>
      </div>

      {/* Customization Options */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Customization Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowMessageOnCake"
              checked={formData.customization.allowMessageOnCake}
              onChange={(e) =>
                onChange("customization.allowMessageOnCake", e.target.checked)
              }
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label
              htmlFor="allowMessageOnCake"
              className="ml-2 text-sm text-gray-700"
            >
              Allow message on cake
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowCustomDesign"
              checked={formData.customization.allowCustomDesign}
              onChange={(e) =>
                onChange("customization.allowCustomDesign", e.target.checked)
              }
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label
              htmlFor="allowCustomDesign"
              className="ml-2 text-sm text-gray-700"
            >
              Allow custom design
            </label>
          </div>

          <div>
            <label
              htmlFor="extraChargeForCustomization"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Extra charge for customization (₹)
            </label>
            <input
              type="number"
              id="extraChargeForCustomization"
              value={formData.customization.extraChargeForCustomization}
              onChange={(e) =>
                onChange(
                  "customization.extraChargeForCustomization",
                  e.target.value
                )
              }
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients
        </label>
        <div className="flex mb-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            placeholder="Add an ingredient"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addIngredient();
              }
            }}
          />
          <button
            type="button"
            onClick={addIngredient}
            className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <FiPlus />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.ingredients.map((ingredient: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="ml-1 text-gray-600 hover:text-red-500 focus:outline-none"
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <FiPlus />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-pink-600 hover:text-red-500 focus:outline-none"
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Product Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Product Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => onChange("isActive", e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active (Ready to Sell)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Featured Product
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isBestSeller"
              checked={formData.isBestSeller}
              onChange={(e) => onChange("isBestSeller", e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isBestSeller"
              className="ml-2 text-sm text-gray-700"
            >
              Best Seller
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isNew"
              checked={formData.isNew}
              onChange={(e) => onChange("isNew", e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="isNew" className="ml-2 text-sm text-gray-700">
              New Arrival
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

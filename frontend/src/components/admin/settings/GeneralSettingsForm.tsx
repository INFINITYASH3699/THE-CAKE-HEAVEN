// components/admin/settings/GeneralSettingsForm.tsx
import { useState } from "react";
import { FiSave, FiUpload } from "react-icons/fi";
import { updateLogo } from "@/services/settingsService";
import toast from "react-hot-toast";
import Image from "next/image";

interface GeneralSettingsFormProps {
  settings: any;
  onSubmit: (data: any) => void;
  isSaving: boolean;
}

const GeneralSettingsForm = ({
  settings,
  onSubmit,
  isSaving,
}: GeneralSettingsFormProps) => {
  const [formData, setFormData] = useState({
    storeName: settings.storeName || "Cake Heaven",
    storeEmail: settings.storeEmail || "",
    storePhone: settings.storePhone || "",
    storeAddress: settings.storeAddress || "",
    currency: settings.currency || "INR",
    currencySymbol: settings.currencySymbol || "₹",
    taxRate: settings.taxRate || 5,
    enableReviews:
      settings.enableReviews !== undefined ? settings.enableReviews : true,
    enableWishlist:
      settings.enableWishlist !== undefined ? settings.enableWishlist : true,
    maintenanceMode: settings.maintenanceMode || false,
    logoUrl: settings.logoUrl || "/logo.png",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleLogoUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logoFile) {
      toast.error("Please select a logo file first");
      return;
    }

    try {
      setLogoUploading(true);

      const formData = new FormData();
      formData.append("logo", logoFile);

      const response = await updateLogo(formData);

      setFormData((prev) => ({
        ...prev,
        logoUrl: response.logoUrl,
      }));

      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Store Information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Basic information about your cake store.
          </p>
        </div>

        {/* Logo Upload Section */}
        <div className="border-t border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Store Logo</h4>
              <p className="mt-1 text-xs text-gray-500">
                Upload your store logo. Recommended size: 200x50px
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-6">
                <div className="relative h-20 w-20 overflow-hidden rounded border border-gray-200">
                  {formData.logoUrl && (
                    <Image
                      src={formData.logoUrl}
                      alt="Store Logo"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload new logo
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="logo"
                      className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      <FiUpload className="inline-block mr-2 -mt-1" />
                      Browse
                    </label>
                    <button
                      type="button"
                      onClick={handleLogoUpload}
                      disabled={!logoFile || logoUploading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                    >
                      {logoUploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {logoFile && (
                    <p className="text-xs text-gray-500">{logoFile.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Details Section */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">
                Store Details
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Basic information about your store
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="storeName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  id="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="storeEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  id="storeEmail"
                  value={formData.storeEmail}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="storePhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  name="storePhone"
                  id="storePhone"
                  value={formData.storePhone}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="storeAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Store Address
                </label>
                <textarea
                  name="storeAddress"
                  id="storeAddress"
                  rows={3}
                  value={formData.storeAddress}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Tax Section */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">
                Currency & Tax
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Configure your store's currency and tax settings
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Currency
                </label>
                <select
                  name="currency"
                  id="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="currencySymbol"
                  className="block text-sm font-medium text-gray-700"
                >
                  Currency Symbol
                </label>
                <input
                  type="text"
                  name="currencySymbol"
                  id="currencySymbol"
                  value={formData.currencySymbol}
                  onChange={handleInputChange}
                  maxLength={2}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="taxRate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  id="taxRate"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Features</h4>
              <p className="mt-1 text-xs text-gray-500">
                Enable or disable store features
              </p>
            </div>
            <div className="col-span-2">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableReviews"
                      name="enableReviews"
                      type="checkbox"
                      checked={formData.enableReviews}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="enableReviews"
                      className="font-medium text-gray-700"
                    >
                      Enable Product Reviews
                    </label>
                    <p className="text-gray-500">
                      Allow customers to leave reviews on products
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableWishlist"
                      name="enableWishlist"
                      type="checkbox"
                      checked={formData.enableWishlist}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="enableWishlist"
                      className="font-medium text-gray-700"
                    >
                      Enable Wishlist
                    </label>
                    <p className="text-gray-500">
                      Allow customers to create wishlists
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="maintenanceMode"
                      name="maintenanceMode"
                      type="checkbox"
                      checked={formData.maintenanceMode}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="maintenanceMode"
                      className="font-medium text-gray-700"
                    >
                      Maintenance Mode
                    </label>
                    <p className="text-gray-500">
                      Put the store in maintenance mode (only admins can access)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {isSaving ? (
              <>
                <span className="mr-2">Saving...</span>
                <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></span>
              </>
            ) : (
              <>
                <FiSave className="mr-2 -ml-1 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GeneralSettingsForm;

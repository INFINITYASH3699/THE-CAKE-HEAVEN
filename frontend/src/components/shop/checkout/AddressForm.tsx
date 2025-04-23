// components/shop/checkout/AddressForm.tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMapPin, FiAlertCircle } from "react-icons/fi";
import { addAddress, updateAddress } from "@/redux/slices/userSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { unwrapResult } from "@reduxjs/toolkit"; // Import unwrapResult

// Define proper types for the address
interface Address {
  _id: string;
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressFormProps {
  addressToEdit?: Partial<Address>;
  onCancel: () => void;
  onSuccess: (addressId: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  addressToEdit,
  onCancel,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    fullName: addressToEdit?.fullName || "",
    mobileNumber: addressToEdit?.mobileNumber || "",
    address: addressToEdit?.address || "",
    city: addressToEdit?.city || "",
    state: addressToEdit?.state || "",
    zip: addressToEdit?.zip || "",
    country: addressToEdit?.country || "India",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (addressToEdit && addressToEdit._id) {
        const resultAction = await dispatch(
          updateAddress({
            addressId: addressToEdit._id,
            addressData: formData,
          })
        );
        // Use unwrapResult to extract the payload and throw if it's an error
        unwrapResult(resultAction);
        onSuccess(addressToEdit._id as string);
      } else {
        const resultAction = await dispatch(addAddress(formData));
        const payload = unwrapResult(resultAction);
        if (payload && payload._id) {
          onSuccess(payload._id);
        }
      }
    } catch (err) {
      // Error will be handled by Redux state already
      console.error("Failed to save address:", err);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="flex items-center mb-4">
        <FiMapPin className="text-pink-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-800">
          {addressToEdit ? "Edit Address" : "Add New Address"}
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label
              htmlFor="city"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              State *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="zip"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Pin Code *
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="country"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
            required
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md flex items-start">
            <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            )}
            {addressToEdit ? "Update Address" : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;

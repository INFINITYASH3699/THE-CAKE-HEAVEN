"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import apiClient from "@/lib/api";
import { FiHome, FiPlus, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";

interface Address {
  _id?: string;
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const initialAddressState: Address = {
  fullName: "",
  mobileNumber: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
  isDefault: false,
};

const AddressesPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] =
    useState<Address>(initialAddressState);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentAddress({ ...currentAddress, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentAddress({ ...currentAddress, [name]: checked });
  };

  const handleAddAddress = () => {
    setCurrentAddress(initialAddressState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await apiClient.delete(`/auth/profile/address/${addressId}`);
      setAddresses(addresses.filter((address) => address._id !== addressId));
      setError("");
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await apiClient.put(`/auth/profile/address/${addressId}`, {
        ...addresses.find((address) => address._id === addressId),
        isDefault: true,
      });

      // Update the local state to reflect the change
      setAddresses(
        addresses.map((address) => ({
          ...address,
          isDefault: address._id === addressId,
        }))
      );

      setError("");
    } catch (err) {
      console.error("Error setting default address:", err);
      setError("Failed to set default address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isEditing && currentAddress._id) {
        // Update existing address
        await apiClient.put(
          `/auth/profile/address/${currentAddress._id}`,
          currentAddress
        );

        setAddresses(
          addresses.map((address) =>
            address._id === currentAddress._id ? currentAddress : address
          )
        );
      } else {
        // Add new address
        const response = await apiClient.post(
          "/auth/profile/address",
          currentAddress
        );
        const newAddress = response.data;

        if (currentAddress.isDefault) {
          // If the new address is default, update all others
          setAddresses([
            ...addresses.map((a) => ({ ...a, isDefault: false })),
            newAddress,
          ]);
        } else {
          setAddresses([...addresses, newAddress]);
        }
      }

      setIsModalOpen(false);
      setCurrentAddress(initialAddressState);
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Failed to save address. Please check the form and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Addresses</h2>
        <button
          onClick={handleAddAddress}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
        >
          <FiPlus className="mr-2" />
          Add New Address
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <FiHome className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No addresses found
          </h3>
          <p className="text-gray-500 mb-4">
            You haven&apos;t added any delivery addresses yet.
          </p>{" "}
          <button
            onClick={handleAddAddress}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
          >
            <FiPlus className="mr-2" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`relative p-6 rounded-lg border ${
                address.isDefault
                  ? "border-pink-400 bg-pink-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    Default
                  </span>
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {address.fullName}
                </h3>
                <p className="text-gray-500">{address.mobileNumber}</p>
              </div>
              <div className="text-gray-700 mb-4">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiEdit2 className="mr-1.5" />
                  Edit
                </button>
                {!address.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefaultAddress(address._id!)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      disabled={loading}
                    >
                      <FiCheck className="mr-1.5" />
                      Set as Default
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id!)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      disabled={loading}
                    >
                      <FiTrash2 className="mr-1.5" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isEditing ? "Edit Address" : "Add New Address"}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="fullName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="fullName"
                              id="fullName"
                              value={currentAddress.fullName}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="mobileNumber"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              name="mobileNumber"
                              id="mobileNumber"
                              value={currentAddress.mobileNumber}
                              onChange={handleInputChange}
                              required
                              pattern="[0-9]{10}"
                              title="Please enter a valid 10-digit mobile number"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={currentAddress.address}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              id="city"
                              value={currentAddress.city}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="state"
                              className="block text-sm font-medium text-gray-700"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              id="state"
                              value={currentAddress.state}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="zip"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Zip/Postal Code
                            </label>
                            <input
                              type="text"
                              name="zip"
                              id="zip"
                              value={currentAddress.zip}
                              onChange={handleInputChange}
                              required
                              pattern="[0-9]{6}"
                              title="Please enter a valid 6-digit zip code"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="country"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Country
                            </label>
                            <select
                              id="country"
                              name="country"
                              value={currentAddress.country}
                              onChange={handleInputChange}
                              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            >
                              <option value="India">India</option>
                              <option value="United States">
                                United States
                              </option>
                              <option value="United Kingdom">
                                United Kingdom
                              </option>
                              <option value="Canada">Canada</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="isDefault"
                            name="isDefault"
                            type="checkbox"
                            checked={currentAddress.isDefault}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="isDefault"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Set as default address
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                      ? "Update Address"
                      : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;

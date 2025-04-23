// components/admin/settings/ShippingSettingsForm.tsx
import { useState } from "react";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface ShippingSettingsFormProps {
  settings: any;
  onSubmit: (data: any) => void;
  isSaving: boolean;
}

const ShippingSettingsForm = ({
  settings,
  onSubmit,
  isSaving,
}: ShippingSettingsFormProps) => {
  const [formData, setFormData] = useState({
    enableShipping: settings.enableShipping !== undefined ? settings.enableShipping : true,
    freeShippingThreshold: settings.freeShippingThreshold || 1000,
    shippingMethods: settings.shippingMethods || [],
    enableLocalPickup: settings.enableLocalPickup !== undefined ? settings.enableLocalPickup : true,
    pickupLocations: settings.pickupLocations || [],
    shippingOrigin: settings.shippingOrigin || {
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  // New shipping method fields
  const [newMethod, setNewMethod] = useState({
    name: "",
    cost: 0,
    minDeliveryDays: 1,
    maxDeliveryDays: 5,
  });

  // New pickup location fields
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactNumber: "",
    openingHours: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      shippingOrigin: {
        ...formData.shippingOrigin,
        [name]: value,
      },
    });
  };

  const handleNewMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNewMethod({
      ...newMethod,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleNewLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewLocation({
      ...newLocation,
      [name]: value,
    });
  };

  const handleAddShippingMethod = () => {
    if (!newMethod.name.trim()) {
      toast.error("Please enter a name for the shipping method");
      return;
    }
    
    setFormData({
      ...formData,
      shippingMethods: [
        ...formData.shippingMethods,
        {
          id: Date.now().toString(),
          ...newMethod,
          isActive: true,
        },
      ],
    });
    
    // Reset new method form
    setNewMethod({
      name: "",
      cost: 0,
      minDeliveryDays: 1,
      maxDeliveryDays: 5,
    });
  };

  const handleAddPickupLocation = () => {
    if (!newLocation.name.trim() || !newLocation.address.trim()) {
      toast.error("Please enter at least a name and address for the pickup location");
      return;
    }
    
    setFormData({
      ...formData,
      pickupLocations: [
        ...formData.pickupLocations,
        {
          id: Date.now().toString(),
          ...newLocation,
          isActive: true,
        },
      ],
    });
    
    // Reset new location form
    setNewLocation({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      contactNumber: "",
      openingHours: "",
    });
  };

  const handleRemoveShippingMethod = (id: string) => {
    setFormData({
      ...formData,
      shippingMethods: formData.shippingMethods.filter(
        (method: any) => method.id !== id
      ),
    });
  };

  const handleRemovePickupLocation = (id: string) => {
    setFormData({
      ...formData,
      pickupLocations: formData.pickupLocations.filter(
        (location: any) => location.id !== id
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Shipping Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure shipping methods and options for your store.
          </p>
        </div>

        {/* General Shipping Settings */}
        <div className="border-t border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">General Settings</h4>
              <p className="mt-1 text-xs text-gray-500">
                Basic shipping configuration
              </p>
            </div>
            <div className="col-span-2 space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableShipping"
                    name="enableShipping"
                    type="checkbox"
                    checked={formData.enableShipping}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableShipping" className="font-medium text-gray-700">
                    Enable Shipping
                  </label>
                  <p className="text-gray-500">Allow shipping products to customers</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  id="freeShippingThreshold"
                  min="0"
                  step="0.01"
                  value={formData.freeShippingThreshold}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Orders above this amount qualify for free shipping. Set to 0 to disable free shipping.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Origin */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Shipping Origin</h4>
              <p className="mt-1 text-xs text-gray-500">
                Address from where you ship your orders
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.shippingOrigin.address}
                  onChange={handleOriginChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.shippingOrigin.city}
                  onChange={handleOriginChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.shippingOrigin.state}
                  onChange={handleOriginChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  value={formData.shippingOrigin.pincode}
                  onChange={handleOriginChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.shippingOrigin.country}
                  onChange={handleOriginChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Shipping Methods</h4>
              <p className="mt-1 text-xs text-gray-500">
                Define different shipping options for your customers
              </p>
            </div>
            <div className="col-span-2">
              {/* Add new shipping method */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Add New Shipping Method
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="methodName" className="block text-sm font-medium text-gray-700">
                      Method Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="methodName"
                      value={newMethod.name}
                      onChange={handleNewMethodChange}
                      placeholder="e.g. Standard Shipping"
                      className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="methodCost" className="block text-sm font-medium text-gray-700">
                      Cost (₹)
                    </label>
                    <input
                      type="number"
                      name="cost"
                      id="methodCost"
                      min="0"
                      step="0.01"
                      value={newMethod.cost}
                      onChange={handleNewMethodChange}
                      placeholder="0.00"
                      className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="minDeliveryDays" className="block text-sm font-medium text-gray-700">
                      Min. Delivery Days
                    </label>
                    <input
                      type="number"
                      name="minDeliveryDays"
                      id="minDeliveryDays"
                      min="1"
                      step="1"
                      value={newMethod.minDeliveryDays}
                      onChange={handleNewMethodChange}
                      className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxDeliveryDays" className="block text-sm font-medium text-gray-700">
                      Max. Delivery Days
                    </label>
                    <input
                      type="number"
                      name="maxDeliveryDays"
                      id="maxDeliveryDays"
                      min="1"
                      step="1"
                      value={newMethod.maxDeliveryDays}
                      onChange={handleNewMethodChange}
                      className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleAddShippingMethod}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <FiPlus className="mr-2 -ml-1 h-4 w-4" />
                    Add Shipping Method
                  </button>
                </div>
              </div>
              
              {/* Shipping methods list */}
              {formData.shippingMethods.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {formData.shippingMethods.map((method: any) => (
                      <li key={method.id} className="p-4 flex items-center justify-between">
                        <div>
                          <h6 className="text-sm font-medium text-gray-900">{method.name}</h6>
                          <p className="text-xs text-gray-500">
                            Cost: {method.cost > 0 ? `₹${method.cost.toFixed(2)}` : 'Free'} | 
                            Delivery: {method.minDeliveryDays}-{method.maxDeliveryDays} days
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveShippingMethod(method.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">
                  No shipping methods added yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Local Pickup */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Local Pickup</h4>
              <p className="mt-1 text-xs text-gray-500">
                Allow customers to pick up orders from your locations
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="enableLocalPickup"
                    name="enableLocalPickup"
                    type="checkbox"
                    checked={formData.enableLocalPickup}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableLocalPickup" className="font-medium text-gray-700">
                    Enable Local Pickup
                  </label>
                  <p className="text-gray-500">Allow customers to pick up their orders</p>
                </div>
              </div>
              
              {formData.enableLocalPickup && (
                <>
                  {/* Add new pickup location */}
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Add New Pickup Location
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">
                          Location Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="locationName"
                          value={newLocation.name}
                          onChange={handleNewLocationChange}
                          placeholder="e.g. Main Store"
                          className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <textarea
                          name="address"
                          id="locationAddress"
                          rows={2}
                          value={newLocation.address}
                          onChange={handleNewLocationChange}
                          placeholder="Full address"
                          className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="locationCity" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="locationCity"
                          value={newLocation.city}
                          onChange={handleNewLocationChange}
                          className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="locationState" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="locationState"
                          value={newLocation.state}
                          onChange={handleNewLocationChange}
                          className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="locationPincode" className="block text-sm font-medium text-gray-700">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          id="locationPincode"
                          value={newLocation.pincode}
                          onChange={handleNewLocationChange}
                          className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          name="contactNumber"
                          id="contactNumber"
                          value={newLocation.contactNumber}
                          onChange={handleNewLocationChange}
                          className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
                          Opening Hours
                        </label>
                        <input
                          type="text"
                          name="openingHours"
                          id="openingHours"
                          value={newLocation.openingHours}
                          onChange={handleNewLocationChange}
                          placeholder="e.g. Mon-Fri: 9am-5pm, Sat: 10am-2pm"
                          className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleAddPickupLocation}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        <FiPlus className="mr-2 -ml-1 h-4 w-4" />
                        Add Pickup Location
                      </button>
                    </div>
                  </div>
                  
                  {/* Pickup locations list */}
                  {formData.pickupLocations.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                      <ul className="divide-y divide-gray-200">
                        {formData.pickupLocations.map((location: any) => (
                          <li key={location.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <h6 className="text-sm font-medium text-gray-900">{location.name}</h6>
                              <button
                                type="button"
                                onClick={() => handleRemovePickupLocation(location.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{location.address}</p>
                            <p className="text-xs text-gray-500">
                              {location.city && `${location.city}, `}
                              {location.state && `${location.state}, `}
                              {location.pincode}
                            </p>
                            {location.contactNumber && (
                              <p className="text-xs text-gray-500 mt-1">
                                Contact: {location.contactNumber}
                              </p>
                            )}
                            {location.openingHours && (
                              <p className="text-xs text-gray-500">
                                Hours: {location.openingHours}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">
                      No pickup locations added yet
                    </p>
                  )}
                </>
              )}
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

export default ShippingSettingsForm;
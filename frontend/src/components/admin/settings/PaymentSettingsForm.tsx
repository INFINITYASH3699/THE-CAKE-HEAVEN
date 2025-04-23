// components/admin/settings/PaymentSettingsForm.tsx
import { useState } from "react";
import { FiSave, FiCreditCard, FiPlus, FiTrash2 } from "react-icons/fi";
import { testPaymentGateway } from "@/services/settingsService";
import toast from "react-hot-toast";

interface PaymentSettingsFormProps {
  settings: any;
  onSubmit: (data: any) => void;
  isSaving: boolean;
}

const PaymentSettingsForm = ({
  settings,
  onSubmit,
  isSaving,
}: PaymentSettingsFormProps) => {
  const [formData, setFormData] = useState({
    enablePaypal: settings.enablePaypal !== undefined ? settings.enablePaypal : false,
    paypalClientId: settings.paypalClientId || "",
    paypalClientSecret: settings.paypalClientSecret || "",
    paypalSandboxMode: settings.paypalSandboxMode !== undefined ? settings.paypalSandboxMode : true,
    
    enableStripe: settings.enableStripe !== undefined ? settings.enableStripe : false,
    stripePublishableKey: settings.stripePublishableKey || "",
    stripeSecretKey: settings.stripeSecretKey || "",
    stripeTestMode: settings.stripeTestMode !== undefined ? settings.stripeTestMode : true,
    
    enableRazorpay: settings.enableRazorpay !== undefined ? settings.enableRazorpay : true,
    razorpayKeyId: settings.razorpayKeyId || "",
    razorpayKeySecret: settings.razorpayKeySecret || "",
    razorpayTestMode: settings.razorpayTestMode !== undefined ? settings.razorpayTestMode : true,
    
    enableCashOnDelivery: settings.enableCashOnDelivery !== undefined ? settings.enableCashOnDelivery : true,
    codFee: settings.codFee || 0,
    
    customPaymentMethods: settings.customPaymentMethods || [],
  });

  const [newMethodName, setNewMethodName] = useState("");
  const [newMethodFee, setNewMethodFee] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

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

  const handleAddCustomMethod = () => {
    if (!newMethodName.trim()) {
      toast.error("Please enter a name for the payment method");
      return;
    }
    
    setFormData({
      ...formData,
      customPaymentMethods: [
        ...formData.customPaymentMethods,
        {
          id: Date.now().toString(),
          name: newMethodName,
          fee: newMethodFee,
          isActive: true,
        },
      ],
    });
    
    setNewMethodName("");
    setNewMethodFee(0);
  };

  const handleRemoveCustomMethod = (id: string) => {
    setFormData({
      ...formData,
      customPaymentMethods: formData.customPaymentMethods.filter(
        (method: any) => method.id !== id
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTestPaymentGateway = async (gateway: string) => {
    try {
      setIsTesting(true);
      let configToTest = {};
      
      switch (gateway) {
        case 'paypal':
          configToTest = {
            gateway: 'paypal',
            clientId: formData.paypalClientId,
            clientSecret: formData.paypalClientSecret,
            sandbox: formData.paypalSandboxMode,
          };
          break;
        case 'stripe':
          configToTest = {
            gateway: 'stripe',
            publishableKey: formData.stripePublishableKey,
            secretKey: formData.stripeSecretKey,
            testMode: formData.stripeTestMode,
          };
          break;
        case 'razorpay':
          configToTest = {
            gateway: 'razorpay',
            keyId: formData.razorpayKeyId,
            keySecret: formData.razorpayKeySecret,
            testMode: formData.razorpayTestMode,
          };
          break;
      }
      
      await testPaymentGateway(configToTest);
      toast.success(`${gateway.charAt(0).toUpperCase() + gateway.slice(1)} configuration is valid!`);
    } catch (error) {
      console.error(`Error testing ${gateway} configuration:`, error);
      toast.error(`Failed to validate ${gateway} configuration. Please check your credentials.`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure payment gateways and options for your store.
          </p>
        </div>

        {/* PayPal Settings */}
        <div className="border-t border-b border-gray-200 py-6">
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="enablePaypal"
                name="enablePaypal"
                type="checkbox"
                checked={formData.enablePaypal}
                onChange={handleInputChange}
                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="enablePaypal" className="font-medium text-gray-700">
                Enable PayPal
              </label>
              <p className="text-gray-500 text-sm">Accept payments via PayPal</p>
            </div>
          </div>
          
          {formData.enablePaypal && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="col-span-1">
                <h4 className="text-sm font-medium text-gray-900">PayPal Configuration</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your PayPal API credentials
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="paypalClientId" className="block text-sm font-medium text-gray-700">
                    Client ID
                  </label>
                  <input
                    type="text"
                    name="paypalClientId"
                    id="paypalClientId"
                    value={formData.paypalClientId}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="paypalClientSecret" className="block text-sm font-medium text-gray-700">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    name="paypalClientSecret"
                    id="paypalClientSecret"
                    value={formData.paypalClientSecret}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="paypalSandboxMode"
                      name="paypalSandboxMode"
                      type="checkbox"
                      checked={formData.paypalSandboxMode}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="paypalSandboxMode" className="font-medium text-gray-700">
                      Sandbox Mode
                    </label>
                    <p className="text-gray-500">Use PayPal sandbox for testing</p>
                  </div>
                </div>
                
                <div>
                  <button
                    type="button"
                    onClick={() => handleTestPaymentGateway('paypal')}
                    disabled={isTesting || !formData.paypalClientId || !formData.paypalClientSecret}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isTesting ? "Testing..." : "Test PayPal Configuration"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stripe Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="enableStripe"
                name="enableStripe"
                type="checkbox"
                checked={formData.enableStripe}
                onChange={handleInputChange}
                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="enableStripe" className="font-medium text-gray-700">
                Enable Stripe
              </label>
              <p className="text-gray-500 text-sm">Accept credit card payments via Stripe</p>
            </div>
          </div>
          
          {formData.enableStripe && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="col-span-1">
                <h4 className="text-sm font-medium text-gray-900">Stripe Configuration</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your Stripe API credentials
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="stripePublishableKey" className="block text-sm font-medium text-gray-700">
                    Publishable Key
                  </label>
                  <input
                    type="text"
                    name="stripePublishableKey"
                    id="stripePublishableKey"
                    value={formData.stripePublishableKey}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="stripeSecretKey" className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    name="stripeSecretKey"
                    id="stripeSecretKey"
                    value={formData.stripeSecretKey}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="stripeTestMode"
                      name="stripeTestMode"
                      type="checkbox"
                      checked={formData.stripeTestMode}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="stripeTestMode" className="font-medium text-gray-700">
                      Test Mode
                    </label>
                    <p className="text-gray-500">Use Stripe test environment</p>
                  </div>
                </div>
                
                <div>
                  <button
                    type="button"
                    onClick={() => handleTestPaymentGateway('stripe')}
                    disabled={isTesting || !formData.stripePublishableKey || !formData.stripeSecretKey}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isTesting ? "Testing..." : "Test Stripe Configuration"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Razorpay Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="enableRazorpay"
                name="enableRazorpay"
                type="checkbox"
                checked={formData.enableRazorpay}
                onChange={handleInputChange}
                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="enableRazorpay" className="font-medium text-gray-700">
                Enable Razorpay
              </label>
              <p className="text-gray-500 text-sm">Accept payments via Razorpay (India)</p>
            </div>
          </div>
          
          {formData.enableRazorpay && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="col-span-1">
                <h4 className="text-sm font-medium text-gray-900">Razorpay Configuration</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your Razorpay API credentials
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="razorpayKeyId" className="block text-sm font-medium text-gray-700">
                    Key ID
                  </label>
                  <input
                    type="text"
                    name="razorpayKeyId"
                    id="razorpayKeyId"
                    value={formData.razorpayKeyId}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="razorpayKeySecret" className="block text-sm font-medium text-gray-700">
                    Key Secret
                  </label>
                  <input
                    type="password"
                    name="razorpayKeySecret"
                    id="razorpayKeySecret"
                    value={formData.razorpayKeySecret}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="razorpayTestMode"
                      name="razorpayTestMode"
                      type="checkbox"
                      checked={formData.razorpayTestMode}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="razorpayTestMode" className="font-medium text-gray-700">
                      Test Mode
                    </label>
                    <p className="text-gray-500">Use Razorpay test environment</p>
                  </div>
                </div>
                
                <div>
                  <button
                    type="button"
                    onClick={() => handleTestPaymentGateway('razorpay')}
                    disabled={isTesting || !formData.razorpayKeyId || !formData.razorpayKeySecret}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isTesting ? "Testing..." : "Test Razorpay Configuration"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cash On Delivery Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="enableCashOnDelivery"
                name="enableCashOnDelivery"
                type="checkbox"
                checked={formData.enableCashOnDelivery}
                onChange={handleInputChange}
                className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="enableCashOnDelivery" className="font-medium text-gray-700">
                Enable Cash On Delivery
              </label>
              <p className="text-gray-500 text-sm">Allow customers to pay when their order is delivered</p>
            </div>
          </div>
          
          {formData.enableCashOnDelivery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="col-span-1">
                <h4 className="text-sm font-medium text-gray-900">COD Settings</h4>
                <p className="mt-1 text-xs text-gray-500">
                  Configure Cash On Delivery options
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="codFee" className="block text-sm font-medium text-gray-700">
                    COD Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="codFee"
                    id="codFee"
                    min="0"
                    step="0.01"
                    value={formData.codFee}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Extra fee charged for Cash On Delivery orders. Set to 0 for no fee.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Payment Methods */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Custom Payment Methods</h4>
              <p className="mt-1 text-xs text-gray-500">
                Add additional custom payment methods
              </p>
            </div>
            <div className="col-span-2">
              <div className="space-y-4">
                {/* Add new method */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="sm:col-span-1">
                    <label htmlFor="newMethodName" className="block text-sm font-medium text-gray-700">
                      Method Name
                    </label>
                    <input
                      type="text"
                      id="newMethodName"
                      value={newMethodName}
                      onChange={(e) => setNewMethodName(e.target.value)}
                      placeholder="e.g. Bank Transfer"
                      className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="newMethodFee" className="block text-sm font-medium text-gray-700">
                      Fee (₹)
                    </label>
                    <input
                      type="number"
                      id="newMethodFee"
                      min="0"
                      step="0.01"
                      value={newMethodFee}
                      onChange={(e) => setNewMethodFee(parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={handleAddCustomMethod}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      <FiPlus className="mr-2 -ml-1 h-4 w-4" />
                      Add Method
                    </button>
                  </div>
                </div>
                
                {/* Custom methods list */}
                {formData.customPaymentMethods.length > 0 ? (
                  <div className="bg-gray-50 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Configured Custom Methods
                    </h5>
                    <ul className="divide-y divide-gray-200">
                      {formData.customPaymentMethods.map((method: any) => (
                        <li key={method.id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{method.name}</p>
                            <p className="text-xs text-gray-500">
                              Fee: {method.fee > 0 ? `₹${method.fee.toFixed(2)}` : 'No fee'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomMethod(method.id)}
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
                    No custom payment methods added yet
                  </p>
                )}
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

export default PaymentSettingsForm;
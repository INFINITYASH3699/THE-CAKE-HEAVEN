// components/admin/settings/UserSettingsForm.tsx
import { useState } from "react";
import { FiSave, FiLock, FiUserCheck } from "react-icons/fi";

interface UserSettingsFormProps {
  settings: any;
  onSubmit: (data: any) => void;
  isSaving: boolean;
}

const UserSettingsForm = ({
  settings,
  onSubmit,
  isSaving,
}: UserSettingsFormProps) => {
  const [formData, setFormData] = useState({
    // Registration settings
    userRegistration:
      settings.userRegistration !== undefined
        ? settings.userRegistration
        : true,
    requireEmailVerification:
      settings.requireEmailVerification !== undefined
        ? settings.requireEmailVerification
        : true,
    requireApproval:
      settings.requireApproval !== undefined ? settings.requireApproval : false,
    allowGuestCheckout:
      settings.allowGuestCheckout !== undefined
        ? settings.allowGuestCheckout
        : true,

    // Account settings
    minimumPasswordLength: settings.minimumPasswordLength || 8,
    passwordRequireUppercase:
      settings.passwordRequireUppercase !== undefined
        ? settings.passwordRequireUppercase
        : true,
    passwordRequireNumber:
      settings.passwordRequireNumber !== undefined
        ? settings.passwordRequireNumber
        : true,
    passwordRequireSymbol:
      settings.passwordRequireSymbol !== undefined
        ? settings.passwordRequireSymbol
        : false,

    // Session settings
    sessionTimeout: settings.sessionTimeout || 60, // in minutes
    maxLoginAttempts: settings.maxLoginAttempts || 5,
    rememberMeDuration: settings.rememberMeDuration || 30, // in days

    // Privacy settings
    storeCustomerIP:
      settings.storeCustomerIP !== undefined ? settings.storeCustomerIP : true,
    storeCustomerLocation:
      settings.storeCustomerLocation !== undefined
        ? settings.storeCustomerLocation
        : false,
    cookieConsentRequired:
      settings.cookieConsentRequired !== undefined
        ? settings.cookieConsentRequired
        : true,

    // Email notification settings
    sendWelcomeEmail:
      settings.sendWelcomeEmail !== undefined
        ? settings.sendWelcomeEmail
        : true,
    sendOrderConfirmation:
      settings.sendOrderConfirmation !== undefined
        ? settings.sendOrderConfirmation
        : true,
    sendShippingUpdates:
      settings.sendShippingUpdates !== undefined
        ? settings.sendShippingUpdates
        : true,
    sendAbandonedCartReminder:
      settings.sendAbandonedCartReminder !== undefined
        ? settings.sendAbandonedCartReminder
        : false,
  });

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
        [name]: parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
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
            User Account Settings
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure registration, authentication, and user account options.
          </p>
        </div>

        {/* Registration Settings */}
        <div className="border-t border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">
                Registration
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Control how users can register and checkout
              </p>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="userRegistration"
                    name="userRegistration"
                    type="checkbox"
                    checked={formData.userRegistration}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="userRegistration"
                    className="font-medium text-gray-700"
                  >
                    Allow User Registration
                  </label>
                  <p className="text-gray-500">
                    Enable users to create accounts on your site
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="requireEmailVerification"
                    name="requireEmailVerification"
                    type="checkbox"
                    checked={formData.requireEmailVerification}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="requireEmailVerification"
                    className="font-medium text-gray-700"
                  >
                    Require Email Verification
                  </label>
                  <p className="text-gray-500">
                    Users must verify their email before logging in
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="requireApproval"
                    name="requireApproval"
                    type="checkbox"
                    checked={formData.requireApproval}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="requireApproval"
                    className="font-medium text-gray-700"
                  >
                    Require Admin Approval
                  </label>
                  <p className="text-gray-500">
                    New registrations must be approved by an administrator
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowGuestCheckout"
                    name="allowGuestCheckout"
                    type="checkbox"
                    checked={formData.allowGuestCheckout}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="allowGuestCheckout"
                    className="font-medium text-gray-700"
                  >
                    Allow Guest Checkout
                  </label>
                  <p className="text-gray-500">
                    Allow customers to checkout without creating an account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">
                Password Policy
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Configure password requirements for user accounts
              </p>
            </div>
            <div className="col-span-2 space-y-6">
              <div>
                <label
                  htmlFor="minimumPasswordLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  name="minimumPasswordLength"
                  id="minimumPasswordLength"
                  min="6"
                  max="30"
                  value={formData.minimumPasswordLength}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="passwordRequireUppercase"
                      name="passwordRequireUppercase"
                      type="checkbox"
                      checked={formData.passwordRequireUppercase}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="passwordRequireUppercase"
                      className="font-medium text-gray-700"
                    >
                      Require Uppercase Letter
                    </label>
                    <p className="text-gray-500">
                      Password must contain at least one uppercase letter
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="passwordRequireNumber"
                      name="passwordRequireNumber"
                      type="checkbox"
                      checked={formData.passwordRequireNumber}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="passwordRequireNumber"
                      className="font-medium text-gray-700"
                    >
                      Require Number
                    </label>
                    <p className="text-gray-500">
                      Password must contain at least one number
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="passwordRequireSymbol"
                      name="passwordRequireSymbol"
                      type="checkbox"
                      checked={formData.passwordRequireSymbol}
                      onChange={handleInputChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="passwordRequireSymbol"
                      className="font-medium text-gray-700"
                    >
                      Require Special Character
                    </label>
                    <p className="text-gray-500">
                      Password must contain at least one special character (e.g.
                      !@#$%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">
                Session Settings
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Configure user session and security options
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="sessionTimeout"
                  className="block text-sm font-medium text-gray-700"
                >
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  name="sessionTimeout"
                  id="sessionTimeout"
                  min="5"
                  max="1440"
                  value={formData.sessionTimeout}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  How long until an inactive user is logged out
                </p>
              </div>

              <div>
                <label
                  htmlFor="maxLoginAttempts"
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  id="maxLoginAttempts"
                  min="3"
                  max="10"
                  value={formData.maxLoginAttempts}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Number of failed login attempts before account is locked
                </p>
              </div>

              <div>
                <label
                  htmlFor="rememberMeDuration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remember Me Duration (days)
                </label>
                <input
                  type="number"
                  name="rememberMeDuration"
                  id="rememberMeDuration"
                  min="1"
                  max="365"
                  value={formData.rememberMeDuration}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  How long to keep a user logged in with "Remember Me"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">
                Privacy Settings
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Configure user data and privacy options
              </p>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="storeCustomerIP"
                    name="storeCustomerIP"
                    type="checkbox"
                    checked={formData.storeCustomerIP}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="storeCustomerIP"
                    className="font-medium text-gray-700"
                  >
                    Store Customer IP Addresses
                  </label>
                  <p className="text-gray-500">
                    Log IP addresses for orders and account activities
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="storeCustomerLocation"
                    name="storeCustomerLocation"
                    type="checkbox"
                    checked={formData.storeCustomerLocation}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="storeCustomerLocation"
                    className="font-medium text-gray-700"
                  >
                    Store Geolocation Data
                  </label>
                  <p className="text-gray-500">
                    Collect and store approximate location data
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="cookieConsentRequired"
                    name="cookieConsentRequired"
                    type="checkbox"
                    checked={formData.cookieConsentRequired}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="cookieConsentRequired"
                    className="font-medium text-gray-700"
                  >
                    Require Cookie Consent
                  </label>
                  <p className="text-gray-500">
                    Show cookie consent notice to visitors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notification Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">
                Email Notifications
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Configure automated emails sent to customers
              </p>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sendWelcomeEmail"
                    name="sendWelcomeEmail"
                    type="checkbox"
                    checked={formData.sendWelcomeEmail}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="sendWelcomeEmail"
                    className="font-medium text-gray-700"
                  >
                    Welcome Email
                  </label>
                  <p className="text-gray-500">
                    Send a welcome email when a user registers
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sendOrderConfirmation"
                    name="sendOrderConfirmation"
                    type="checkbox"
                    checked={formData.sendOrderConfirmation}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="sendOrderConfirmation"
                    className="font-medium text-gray-700"
                  >
                    Order Confirmation
                  </label>
                  <p className="text-gray-500">
                    Send an email when a customer places an order
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sendShippingUpdates"
                    name="sendShippingUpdates"
                    type="checkbox"
                    checked={formData.sendShippingUpdates}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="sendShippingUpdates"
                    className="font-medium text-gray-700"
                  >
                    Shipping Updates
                  </label>
                  <p className="text-gray-500">
                    Send emails when order status changes
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sendAbandonedCartReminder"
                    name="sendAbandonedCartReminder"
                    type="checkbox"
                    checked={formData.sendAbandonedCartReminder}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="sendAbandonedCartReminder"
                    className="font-medium text-gray-700"
                  >
                    Abandoned Cart Reminder
                  </label>
                  <p className="text-gray-500">
                    Remind customers about items left in their cart
                  </p>
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

export default UserSettingsForm;

// components/admin/settings/EmailSettingsForm.tsx
import { useState } from "react";
import { FiSave, FiSend } from "react-icons/fi";
import { testEmailConfiguration } from "@/services/settingsService";
import toast from "react-hot-toast";

interface EmailSettingsFormProps {
  settings: any;
  onSubmit: (data: any) => void;
  isSaving: boolean;
}

const EmailSettingsForm = ({
  settings,
  onSubmit,
  isSaving,
}: EmailSettingsFormProps) => {
  const [formData, setFormData] = useState({
    smtpHost: settings.smtpHost || "",
    smtpPort: settings.smtpPort || 587,
    smtpUser: settings.smtpUser || "",
    smtpPassword: settings.smtpPassword || "",
    smtpFrom: settings.smtpFrom || "",
    smtpFromName: settings.smtpFromName || "Cake Heaven",
    enableSSL: settings.enableSSL !== undefined ? settings.enableSSL : true,
    enableTemplates: settings.enableTemplates !== undefined ? settings.enableTemplates : true,
  });

  const [testEmail, setTestEmail] = useState("");
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
        [name]: parseInt(value),
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

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }
    
    try {
      setIsTesting(true);
      await testEmailConfiguration({
        ...formData,
        testEmail,
      });
      toast.success("Test email sent successfully!");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email. Please check your configuration.");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configure your store's email server settings for sending notifications.
          </p>
        </div>

        {/* SMTP Settings */}
        <div className="border-t border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">SMTP Configuration</h4>
              <p className="mt-1 text-xs text-gray-500">
                SMTP settings for sending emails
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtpHost"
                    id="smtpHost"
                    value={formData.smtpHost}
                    onChange={handleInputChange}
                    placeholder="e.g. smtp.gmail.com"
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    name="smtpPort"
                    id="smtpPort"
                    value={formData.smtpPort}
                    onChange={handleInputChange}
                    placeholder="e.g. 587"
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700">
                  SMTP Username
                </label>
                <input
                  type="text"
                  name="smtpUser"
                  id="smtpUser"
                  value={formData.smtpUser}
                  onChange={handleInputChange}
                  placeholder="e.g. your-email@gmail.com"
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                  SMTP Password
                </label>
                <input
                  type="password"
                  name="smtpPassword"
                  id="smtpPassword"
                  value={formData.smtpPassword}
                  onChange={handleInputChange}
                  placeholder="Your SMTP password"
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  For Gmail, you may need to create an App Password
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableSSL"
                    name="enableSSL"
                    type="checkbox"
                    checked={formData.enableSSL}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableSSL" className="font-medium text-gray-700">
                    Enable SSL/TLS
                  </label>
                  <p className="text-gray-500">Secure connection for sending emails</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* From Email Settings */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">From Email</h4>
              <p className="mt-1 text-xs text-gray-500">
                Configure the From address for outgoing emails
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="smtpFrom" className="block text-sm font-medium text-gray-700">
                  From Email Address
                </label>
                <input
                  type="email"
                  name="smtpFrom"
                  id="smtpFrom"
                  value={formData.smtpFrom}
                  onChange={handleInputChange}
                  placeholder="e.g. noreply@cakeheaven.com"
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="smtpFromName" className="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input
                  type="text"
                  name="smtpFromName"
                  id="smtpFromName"
                  value={formData.smtpFromName}
                  onChange={handleInputChange}
                  placeholder="e.g. Cake Heaven"
                  className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Email Templates</h4>
              <p className="mt-1 text-xs text-gray-500">
                Configure email template settings
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableTemplates"
                    name="enableTemplates"
                    type="checkbox"
                    checked={formData.enableTemplates}
                    onChange={handleInputChange}
                    className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableTemplates" className="font-medium text-gray-700">
                    Enable HTML Email Templates
                  </label>
                  <p className="text-gray-500">Send styled HTML emails instead of plain text</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Email */}
        <div className="border-b border-gray-200 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-900">Test Configuration</h4>
              <p className="mt-1 text-xs text-gray-500">
                Send a test email to verify your settings
              </p>
            </div>
            <div className="col-span-2">
              <div className="flex space-x-4">
                <div className="flex-grow">
                  <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700">
                    Test Email Address
                  </label>
                  <input
                    type="email"
                    id="testEmail"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email to receive test"
                    className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={isTesting || !testEmail}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <span className="mr-2">Sending...</span>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></span>
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2 -ml-1 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </button>
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

export default EmailSettingsForm;
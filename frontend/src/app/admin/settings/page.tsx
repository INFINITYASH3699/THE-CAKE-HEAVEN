// app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { fetchSettings, updateSettings } from "@/services/settingsService";
import PageHeader from "@/components/admin/common/PageHeader";
import LoadingState from "@/components/admin/common/LoadingState";
import ErrorState from "@/components/admin/common/ErrorState";
import GeneralSettingsForm from "@/components/admin/settings/GeneralSettingsForm";
import EmailSettingsForm from "@/components/admin/settings/EmailSettingsForm";
import PaymentSettingsForm from "@/components/admin/settings/PaymentSettingsForm";
import ShippingSettingsForm from "@/components/admin/settings/ShippingSettingsForm";
import UserSettingsForm from "@/components/admin/settings/UserSettingsForm";
import toast from "react-hot-toast";

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Fetch settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSettings();
        setSettings(data);
        setError("");
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle settings updates
  const handleSettingsUpdate = async (formData: any, section: string) => {
    try {
      setSaving(true);
      setSuccessMessage("");
      
      // Create a new settings object with the updated section
      const updatedSettings = {
        ...settings,
        [section]: formData,
      };
      
      // Send the update to the server
      await updateSettings(updatedSettings);
      
      // Update local state
      setSettings(updatedSettings);
      
      // Show success message
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully.`);
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(`Error updating ${section} settings:`, err);
      toast.error(`Failed to update ${section} settings. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader title="Settings" />
        <LoadingState />
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <PageHeader title="Settings" />
        <ErrorState
          message={error || "Failed to load settings"}
          buttonText="Try Again"
          onButtonClick={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <PageHeader title="Settings" />
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
          <FiCheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List className="flex border-b border-gray-200">
            <Tab className={({ selected }) => `px-6 py-3 text-sm font-medium ${
              selected 
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}>
              General
            </Tab>
            <Tab className={({ selected }) => `px-6 py-3 text-sm font-medium ${
              selected 
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}>
              Email
            </Tab>
            <Tab className={({ selected }) => `px-6 py-3 text-sm font-medium ${
              selected 
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}>
              Payment
            </Tab>
            <Tab className={({ selected }) => `px-6 py-3 text-sm font-medium ${
              selected 
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}>
              Shipping
            </Tab>
            <Tab className={({ selected }) => `px-6 py-3 text-sm font-medium ${
              selected 
                ? 'border-b-2 border-pink-500 text-pink-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}>
              Users
            </Tab>
          </Tab.List>
          
          <Tab.Panels>
            <Tab.Panel className="p-6">
              <GeneralSettingsForm 
                settings={settings.general || {}} 
                onSubmit={(data) => handleSettingsUpdate(data, "general")}
                isSaving={saving}
              />
            </Tab.Panel>
            
            <Tab.Panel className="p-6">
              <EmailSettingsForm 
                settings={settings.email || {}} 
                onSubmit={(data) => handleSettingsUpdate(data, "email")}
                isSaving={saving}
              />
            </Tab.Panel>
            
            <Tab.Panel className="p-6">
              <PaymentSettingsForm 
                settings={settings.payment || {}} 
                onSubmit={(data) => handleSettingsUpdate(data, "payment")}
                isSaving={saving}
              />
            </Tab.Panel>
            
            <Tab.Panel className="p-6">
              <ShippingSettingsForm 
                settings={settings.shipping || {}} 
                onSubmit={(data) => handleSettingsUpdate(data, "shipping")}
                isSaving={saving}
              />
            </Tab.Panel>
            
            <Tab.Panel className="p-6">
              <UserSettingsForm 
                settings={settings.user || {}} 
                onSubmit={(data) => handleSettingsUpdate(data, "user")}
                isSaving={saving}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
// components/shop/checkout/DeliveryOptions.tsx
import React from "react";
import { FiTruck, FiZap, FiClock } from "react-icons/fi";

interface DeliveryOptionsProps {
  selectedOption: string;
  onChange: (option: string) => void;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedOption,
  onChange,
}) => {
  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "Delivered in 2-3 business days",
      price: "₹100 (Free over ₹1000)",
      icon: <FiTruck className="w-6 h-6" />,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "Delivered in 1-2 business days",
      price: "₹150",
      icon: <FiZap className="w-6 h-6" />,
    },
    {
      id: "same-day",
      name: "Same Day Delivery",
      description: "Delivered within 6 hours (order before 2 PM)",
      price: "₹200",
      icon: <FiClock className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-4">
      {deliveryOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`border rounded-lg p-4 flex items-center cursor-pointer transition-colors ${
            selectedOption === option.id
              ? "border-pink-500 bg-pink-50"
              : "border-gray-200 hover:border-pink-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
              selectedOption === option.id ? "border-pink-500" : "border-gray-300"
            }`}
          >
            {selectedOption === option.id && (
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            )}
          </div>
          
          <div className={`mr-4 text-${selectedOption === option.id ? "pink" : "gray"}-600`}>
            {option.icon}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{option.name}</h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </div>
          
          <div className="text-right">
            <p className="font-medium text-gray-800">{option.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryOptions;
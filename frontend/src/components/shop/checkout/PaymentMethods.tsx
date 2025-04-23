// components/shop/checkout/PaymentMethods.tsx
import React from "react";
import {
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
} from "react-icons/fi";
import { SiPaypal } from "react-icons/si";

interface PaymentMethodsProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onChange,
}) => {
  const paymentOptions = [
    {
      id: "credit_card",
      name: "Credit Card",
      description: "Pay securely with your credit card.",
      icon: <FiCreditCard className="w-6 h-6" />,
    },
    {
      id: "debit_card",
      name: "Debit Card",
      description: "Pay directly from your bank account.",
      icon: <FiCreditCard className="w-6 h-6" />,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Fast and secure payment with PayPal.",
      icon: <SiPaypal className="w-6 h-6" />,
    },
    {
      id: "wallet",
      name: "Wallet",
      description: "Pay using your Cake Heaven wallet balance.",
      icon: <FiSmartphone className="w-6 h-6" />,
    },
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      description: "Pay when you receive your order.",
      icon: <FiDollarSign className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-4">
      {paymentOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`border rounded-lg p-4 flex items-center cursor-pointer transition-colors ${
            selectedMethod === option.id
              ? "border-pink-500 bg-pink-50"
              : "border-gray-200 hover:border-pink-300"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
              selectedMethod === option.id ? "border-pink-500" : "border-gray-300"
            }`}
          >
            {selectedMethod === option.id && (
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            )}
          </div>
          
          <div className={`mr-4 text-${selectedMethod === option.id ? "pink" : "gray"}-600`}>
            {option.icon}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800">{option.name}</h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
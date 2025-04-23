// components/shop/checkout/OrderSummary.tsx
import React from "react";
import Image from "next/image";
import { FiTag } from "react-icons/fi";

// Define a proper type for cart items
interface CartItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    discountPrice?: number;
    flavor: string;
    weight: string;
    images: string[];
  };
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax,
  shipping,
  discount,
  couponCode,
  total,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
      </div>

      <div className="px-6 py-4">
        <div className="max-h-60 overflow-y-auto mb-4 pr-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center mb-3 pb-3 border-b border-gray-100"
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-bl-md px-1">
                  {item.quantity}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                  {item.product.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {item.product.flavor}, {item.product.weight}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ₹
                  {(
                    (item.product.discountPrice || item.product.price) *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `₹${shipping.toFixed(2)}`
              )}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center">
                <FiTag className="mr-1" />
                Discount {couponCode && `(${couponCode})`}
              </span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

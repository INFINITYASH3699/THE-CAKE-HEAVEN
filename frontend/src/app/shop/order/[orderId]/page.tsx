"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiTruck,
  FiMapPin,
  FiCreditCard,
  FiArrowLeft,
  FiPrinter,
  FiClock,
} from "react-icons/fi";
import { getOrderDetails } from "@/redux/slices/orderSlice";
import { RootState, AppDispatch } from "@/redux/store";

// Define types for better type safety
interface OrderStatus {
  status: string;
  date: string;
  comment?: string;
}

interface OrderItem {
  _id?: string;
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customizations?: {
    messageOnCake?: string;
    specialInstructions?: string;
  };
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  mobileNumber: string;
}

interface OrderDetails {
  orderFor: string;
  birthDate?: string;
  specialInstructions?: string;
}

interface OrderType {
  _id: string;
  orderNumber: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  discountAmount: number;
  walletAmountUsed?: number;
  couponCode?: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: string;
  statusHistory?: OrderStatus[];
  cancelReason?: string;
  deliveryOption: string;
  orderDetails?: OrderDetails;
  estimatedDeliveryDate?: string;
  createdAt: string;
}

const OrderPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { order, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [timeLeft, setTimeLeft] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  // Type assertion for order to use our OrderType interface
  const typedOrder = order as OrderType | null;

  useEffect(() => {
    // Check if orderId is valid
    if (!orderId || orderId === "undefined") {
      console.error("Invalid order ID:", orderId);
      router.push("/profile/orders");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?redirect=/shop/order/" + orderId);
      return;
    }

    // Fetch order details
    console.log("Fetching order details for ID:", orderId);
    dispatch(getOrderDetails(orderId as string))
      .unwrap()
      .then((data) => {
        console.log("Order details loaded successfully:", data);
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error("Error loading order:", err);
        setInitialLoading(false);
      });
  }, [dispatch, orderId, isAuthenticated, router]);

  // Calculate time left for delivery (for UI purposes)
  useEffect(() => {
    if (typedOrder && typedOrder.estimatedDeliveryDate) {
      const calculateTimeLeft = () => {
        const now = new Date();
        const estimatedDelivery = new Date(typedOrder.estimatedDeliveryDate!);

        if (now >= estimatedDelivery) {
          setTimeLeft("Delivery time reached");
          return;
        }

        const diff = estimatedDelivery.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        let timeString = "";
        if (days > 0) timeString += `${days}d `;
        if (hours > 0) timeString += `${hours}h `;
        timeString += `${minutes}m`;

        setTimeLeft(timeString);
      };

      calculateTimeLeft();
      const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [typedOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "shipped":
        return "Shipped";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Show loading state while initial data is being fetched
  if (loading || initialLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-medium text-red-700 mb-4">
            Error Loading Order
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            href="/profile/orders"
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Show not found state when order is null or undefined
  if (!typedOrder) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Link
            href="/profile/orders"
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Order #{typedOrder.orderNumber || "N/A"}
        </h1>
        <div className="flex space-x-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <FiPrinter className="mr-1" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <Link
            href="/profile/orders"
            className="flex items-center px-3 py-1 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200"
          >
            <FiArrowLeft className="mr-1" />
            <span className="hidden sm:inline">Back to Orders</span>
          </Link>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  typedOrder.status
                )}`}
              >
                {getStatusText(typedOrder.status)}
              </span>
              <p className="text-gray-600 mt-2">
                Order placed on{" "}
                {new Date(typedOrder.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {typedOrder.estimatedDeliveryDate && (
              <div className="mt-4 md:mt-0 md:text-right">
                <h3 className="text-gray-700 font-medium">
                  Estimated Delivery
                </h3>
                <p className="text-gray-900">
                  {new Date(
                    typedOrder.estimatedDeliveryDate
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {typedOrder.status !== "delivered" &&
                  typedOrder.status !== "cancelled" && (
                    <p className="flex items-center justify-end mt-1 text-pink-600">
                      <FiClock className="mr-1" />
                      {timeLeft} remaining
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* Order Tracking */}
          {typedOrder.status !== "cancelled" &&
            typedOrder.status !== "refunded" && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Order Status
                </h3>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-7 w-1 bg-gray-200 z-0"></div>
                  <ul className="relative z-10">
                    {Array.isArray(typedOrder.statusHistory) &&
                    typedOrder.statusHistory.length > 0 ? (
                      [...typedOrder.statusHistory]
                        .reverse()
                        .map((status: OrderStatus, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start mb-6 last:mb-0"
                          >
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                idx === 0
                                  ? "bg-pink-100 text-pink-600"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {idx === 0 && status.status === "delivered" ? (
                                <FiCheckCircle className="w-6 h-6" />
                              ) : idx === 0 && status.status === "shipped" ? (
                                <FiTruck className="w-6 h-6" />
                              ) : (
                                <FiShoppingBag className="w-6 h-6" />
                              )}
                            </div>
                            <div className="ml-4">
                              <h4
                                className={`font-medium ${
                                  idx === 0 ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {getStatusText(status.status)}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(status.date).toLocaleString()}
                              </p>
                              {status.comment && (
                                <p className="text-sm mt-1">{status.comment}</p>
                              )}
                            </div>
                          </li>
                        ))
                    ) : (
                      <li className="flex items-start mb-6">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-100 text-gray-500">
                          <FiShoppingBag className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-gray-700">
                            Order Received
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(typedOrder.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

          {/* Cancellation Reason */}
          {typedOrder.status === "cancelled" && typedOrder.cancelReason && (
            <div className="mb-8 bg-red-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Cancellation Reason
              </h3>
              <p className="text-red-700">{typedOrder.cancelReason}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiShoppingBag className="mr-2" /> Order Items
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {typedOrder.orderItems && typedOrder.orderItems.length > 0 ? (
                typedOrder.orderItems.map((item: OrderItem, index: number) => (
                  <div
                    key={item._id || `item-${index}`}
                    className="p-6 flex items-start"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.image || "/images/placeholder.jpg"}
                        alt={item.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link
                        href={`/shop/product/${item.product}`}
                        className="text-lg font-medium text-gray-800 hover:text-pink-500"
                      >
                        {item.name || "Product"}
                      </Link>
                      {item.customizations && (
                        <div className="mt-1 text-sm text-gray-600">
                          {item.customizations.messageOnCake && (
                            <p>
                              Message: &quot;{item.customizations.messageOnCake}
                              &quot;
                            </p>
                          )}
                          {item.customizations.specialInstructions && (
                            <p>
                              Instructions:{" "}
                              {item.customizations.specialInstructions}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{(item.price || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No items found in this order.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Order Summary
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{(typedOrder.itemsPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{(typedOrder.taxPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {typedOrder.shippingPrice === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${(typedOrder.shippingPrice || 0).toFixed(2)}`
                  )}
                </span>
              </div>
              {typedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount{" "}
                    {typedOrder.couponCode && `(${typedOrder.couponCode})`}
                  </span>
                  <span>-₹{(typedOrder.discountAmount || 0).toFixed(2)}</span>
                </div>
              )}
              {typedOrder.walletAmountUsed &&
                typedOrder.walletAmountUsed > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Wallet Credit</span>
                    <span>-₹{typedOrder.walletAmountUsed.toFixed(2)}</span>
                  </div>
                )}
              <div className="pt-4 border-t border-gray-200 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{(typedOrder.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping, Payment, Delivery Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-800 flex items-center">
                  <FiMapPin className="mr-2" /> Shipping Address
                </h2>
              </div>
              <div className="px-6 py-4">
                {typedOrder.shippingAddress ? (
                  <>
                    <p className="font-medium">
                      {typedOrder.shippingAddress.fullName || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      {typedOrder.shippingAddress.address || "N/A"},{" "}
                      {typedOrder.shippingAddress.city || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      {typedOrder.shippingAddress.state || "N/A"}{" "}
                      {typedOrder.shippingAddress.zip || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      {typedOrder.shippingAddress.country || "N/A"}
                    </p>
                    <p className="text-gray-600 mt-2">
                      {typedOrder.shippingAddress.mobileNumber || "N/A"}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">
                    Shipping address not available
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-800 flex items-center">
                  <FiCreditCard className="mr-2" /> Payment Information
                </h2>
              </div>
              <div className="px-6 py-4">
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {typedOrder.paymentMethod === "credit_card"
                    ? "Credit Card"
                    : typedOrder.paymentMethod === "debit_card"
                      ? "Debit Card"
                      : typedOrder.paymentMethod === "paypal"
                        ? "PayPal"
                        : typedOrder.paymentMethod === "wallet"
                          ? "Wallet"
                          : "Cash on Delivery"}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`${
                      typedOrder.isPaid ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {typedOrder.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                </p>
                {typedOrder.isPaid && typedOrder.paidAt && (
                  <p className="text-sm text-gray-600 mt-1">
                    Paid on{" "}
                    {new Date(typedOrder.paidAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-800 flex items-center">
                  <FiTruck className="mr-2" /> Delivery Information
                </h2>
              </div>
              <div className="px-6 py-4">
                <p>
                  <span className="font-medium">Option:</span>{" "}
                  {typedOrder.deliveryOption === "standard"
                    ? "Standard Delivery"
                    : typedOrder.deliveryOption === "express"
                      ? "Express Delivery"
                      : "Same Day Delivery"}
                </p>
                {typedOrder.orderDetails && (
                  <>
                    <p className="mt-2">
                      <span className="font-medium">Order For:</span>{" "}
                      {typedOrder.orderDetails.orderFor || "Self"}
                    </p>
                    {typedOrder.orderDetails.birthDate && (
                      <p>
                        <span className="font-medium">Celebration Date:</span>{" "}
                        {typedOrder.orderDetails.birthDate}
                      </p>
                    )}
                    {typedOrder.orderDetails.specialInstructions && (
                      <p className="mt-1">
                        <span className="font-medium">
                          Special Instructions:
                        </span>{" "}
                        {typedOrder.orderDetails.specialInstructions}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

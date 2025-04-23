"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiShoppingBag,
  FiTruck,
  FiAlertCircle,
  FiLock,
  FiChevronLeft,
  FiPlusCircle,
  FiEdit,
  FiCheckCircle,
} from "react-icons/fi";
import { RootState, AppDispatch } from "@/redux/store";
import AddressForm from "@/components/shop/checkout/AddressForm";
import PaymentMethods from "@/components/shop/checkout/PaymentMethods";
import OrderSummary from "@/components/shop/checkout/OrderSummary";
import DeliveryOptions from "@/components/shop/checkout/DeliveryOptions";
import {
  createOrder,
  resetOrderSuccess,
  // Import the OrderData type from the slice
} from "@/redux/slices/orderSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import { Address } from "@/types/index";

// Define interfaces for better type safety
interface CustomizationOptions {
  messageOnCake?: string;
  specialInstructions?: string;
}

// Define the CartItemType interface to use with cart items
interface CartItemType {
  id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    flavor: string;
    weight: string;
  };
  quantity: number;
  customizations?: CustomizationOptions;
}

// Match this type with the OrderDetails in the slice
interface OrderDetailsType {
  orderFor: string;
  birthDate?: string;
  specialInstructions?: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Add type annotation to the items from the cart to use CartItemType
  const { items } = useSelector((state: RootState) => state.cart) as {
    items: CartItemType[];
  };

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { coupon, discount } = useSelector((state: RootState) => state.coupon);
  const { success, error } = useSelector((state: RootState) => state.order);

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType>({
    orderFor: "Self",
    birthDate: "",
    specialInstructions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  // Helper function that explicitly uses the Address type
  const getSelectedAddress = (): Address | undefined => {
    return user?.addresses?.find((address) => address._id === selectedAddress);
  };

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.05; // 5% tax

  // Shipping cost based on delivery option
  const getShippingCost = () => {
    if (subtotal > 1000) return 0; // Free shipping over ₹1000

    switch (deliveryOption) {
      case "express":
        return 150;
      case "same-day":
        return 200;
      default:
        return 100; // standard
    }
  };

  const shipping = getShippingCost();
  const total = subtotal + tax + shipping - (discount || 0);

  // Handle address change
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  // Handle delivery option change
  const handleDeliveryOptionChange = (option: string) => {
    setDeliveryOption(option);
  };

  // Handle order details change
  const handleOrderDetailsChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setOrderDetails({
      ...orderDetails,
      [name]: value,
    });
  };

  // Navigate steps
  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Validate the order before submission
  const validateOrder = () => {
    if (!selectedAddress) {
      setProcessError("Please select a shipping address");
      return false;
    }

    const selectedAddressObj = getSelectedAddress();

    if (!selectedAddressObj) {
      setProcessError("Invalid shipping address");
      return false;
    }

    if (items.length === 0) {
      setProcessError("Your cart is empty");
      return false;
    }

    setProcessError(null);
    return true;
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!validateOrder()) {
      toast.error(processError || "Please check your order details");
      return;
    }

    setIsSubmitting(true);
    setProcessError(null);

    const selectedAddressObj = getSelectedAddress();

    if (!selectedAddressObj) {
      setIsSubmitting(false);
      setProcessError("Invalid shipping address");
      return;
    }

    try {
      console.log("Starting order placement...");

      // Create a shipping address object matching the expected format
      const shippingAddress = {
        fullName: selectedAddressObj.fullName,
        mobileNumber: selectedAddressObj.mobileNumber,
        address: selectedAddressObj.address,
        city: selectedAddressObj.city,
        state: selectedAddressObj.state,
        zip: selectedAddressObj.zip,
        country: selectedAddressObj.country,
      };

      // Create the order data (matches the slice's OrderData type)
      const orderData = {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.images[0],
          price: item.product.discountPrice || item.product.price,
          customizations: item.customizations || {},
        })),
        shippingAddress,
        paymentMethod,
        deliveryOption,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        discountAmount: discount || 0,
        couponCode: coupon?.code || "",
        totalPrice: total,
        orderDetails,
      };

      console.log("Dispatching createOrder with data:", orderData);

      const resultAction = await dispatch(createOrder(orderData));
      const result = resultAction.payload;

      console.log("Order creation result:", result);

      setIsSubmitting(false);

      if (resultAction.type.endsWith("fulfilled")) {
        toast.success("Order placed successfully!");
        dispatch(clearCart());

        // Verify we have the order object and ID before redirecting
        if (result && result.order && result.order._id) {
          console.log("Redirecting to order page:", result.order._id);
          router.push(`/shop/order/${result.order._id}`);
        } else {
          console.error(
            "Order created but missing orderId in response:",
            result
          );
          toast.success("Order placed successfully! Check your order history.");
          router.push("/profile/orders");
        }
      } else if (resultAction.type.endsWith("rejected")) {
        const errorMessage = resultAction.payload || "Failed to place order";
        toast.error(errorMessage);
        setProcessError(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Order placement error:", error);
      setIsSubmitting(false);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setProcessError(errorMessage);
    }
  };

  // Reset order success state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetOrderSuccess());
    };
  }, [dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/shop/checkout");
    }
  }, [isAuthenticated, router]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push("/shop/cart");
    }
  }, [items, success, router]);

  // Select first address by default if none is selected
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddress) {
      // Add a check to ensure _id exists before setting it
      const firstAddressId = user.addresses[0]._id;
      if (firstAddressId) {
        setSelectedAddress(firstAddressId);
      }
    }
  }, [user, selectedAddress]);

  return (
    <div className="container mx-auto px-24 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between max-w-3xl mx-auto">
          <div
            className={`flex flex-col items-center ${
              step >= 1 ? "text-pink-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                step >= 1 ? "bg-pink-100" : "bg-gray-100"
              }`}
            >
              <FiMapPin className="w-5 h-5" />
            </div>
            <span className="text-sm">Shipping</span>
          </div>

          <div className="hidden md:block h-0.5 flex-1 self-center mx-4 bg-gray-200"></div>

          <div
            className={`flex flex-col items-center ${
              step >= 2 ? "text-pink-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                step >= 2 ? "bg-pink-100" : "bg-gray-100"
              }`}
            >
              <FiTruck className="w-5 h-5" />
            </div>
            <span className="text-sm">Delivery</span>
          </div>

          <div className="hidden md:block h-0.5 flex-1 self-center mx-4 bg-gray-200"></div>

          <div
            className={`flex flex-col items-center ${
              step >= 3 ? "text-pink-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                step >= 3 ? "bg-pink-100" : "bg-gray-100"
              }`}
            >
              <FiCreditCard className="w-5 h-5" />
            </div>
            <span className="text-sm">Payment</span>
          </div>

          <div className="hidden md:block h-0.5 flex-1 self-center mx-4 bg-gray-200"></div>

          <div
            className={`flex flex-col items-center ${
              step >= 4 ? "text-pink-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                step >= 4 ? "bg-pink-100" : "bg-gray-100"
              }`}
            >
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm">Review</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Shipping Address
                </h2>

                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {user.addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          selectedAddress === address._id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                        onClick={() =>
                          address._id && handleAddressSelect(address._id)
                        }
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {address.fullName}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.address}, {address.city}, {address.state}{" "}
                              {address.zip}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.country}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              <FiPhone className="inline-block mr-1" />
                              {address.mobileNumber}
                            </p>
                          </div>

                          <div className="flex flex-col">
                            {selectedAddress === address._id && (
                              <span className="text-pink-600 mb-auto">
                                <FiCheckCircle className="w-5 h-5" />
                              </span>
                            )}
                            <button
                              className="text-gray-500 hover:text-pink-600 text-sm mt-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAddressForm(true);
                              }}
                            >
                              <FiEdit className="inline-block mr-1" />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg mb-6">
                    <p className="text-gray-600 mb-4">
                      You don&apos;t have any saved addresses. Please add a new
                      address.
                    </p>
                  </div>
                )}

                <button
                  className="flex items-center text-pink-600 hover:text-pink-700 mb-8"
                  onClick={() => setShowAddressForm(true)}
                >
                  <FiPlusCircle className="mr-2" />
                  Add a New Address
                </button>

                {showAddressForm && (
                  <AddressForm
                    onCancel={() => setShowAddressForm(false)}
                    onSuccess={(addressId) => {
                      setShowAddressForm(false);
                      setSelectedAddress(addressId);
                    }}
                  />
                )}

                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!selectedAddress}
                    className={`px-6 py-2 rounded-md flex items-center ${
                      selectedAddress
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue to Delivery
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Options */}
            {step === 2 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Delivery Options
                </h2>

                <DeliveryOptions
                  selectedOption={deliveryOption}
                  onChange={handleDeliveryOptionChange}
                />

                <div className="mt-8">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Order Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Order For
                      </label>
                      <select
                        name="orderFor"
                        value={orderDetails.orderFor}
                        onChange={handleOrderDetailsChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                      >
                        <option value="Self">Self</option>
                        <option value="Friend">Friend</option>
                        <option value="Family">Family</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Celebration Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={orderDetails.birthDate}
                        onChange={handleOrderDetailsChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        name="specialInstructions"
                        value={orderDetails.specialInstructions}
                        onChange={handleOrderDetailsChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                  >
                    <FiChevronLeft className="mr-2" />
                    Back to Shipping
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Methods */}
            {step === 3 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Method
                </h2>

                <PaymentMethods
                  selectedMethod={paymentMethod}
                  onChange={handlePaymentMethodChange}
                />

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                  >
                    <FiChevronLeft className="mr-2" />
                    Back to Delivery
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Order Review */}
            {step === 4 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Review Your Order
                </h2>

                {/* Selected Address */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">
                      <FiMapPin className="inline-block mr-2" />
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-pink-600 hover:text-pink-700"
                    >
                      Change
                    </button>
                  </div>

                  {user?.addresses &&
                    selectedAddress &&
                    (() => {
                      const address = getSelectedAddress();

                      if (address) {
                        return (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-sm text-gray-600">
                              {address.address}, {address.city}, {address.state}{" "}
                              {address.zip}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.country}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <FiPhone className="inline-block mr-1" />
                              {address.mobileNumber}
                            </p>
                          </div>
                        );
                      }

                      return null;
                    })()}
                </div>

                {/* Delivery Option */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">
                      <FiTruck className="inline-block mr-2" />
                      Delivery Option
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-sm text-pink-600 hover:text-pink-700"
                    >
                      Change
                    </button>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">
                      {deliveryOption === "standard" &&
                        "Standard Delivery (2-3 days)"}
                      {deliveryOption === "express" &&
                        "Express Delivery (1-2 days)"}
                      {deliveryOption === "same-day" && "Same Day Delivery"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {orderDetails.birthDate && (
                        <span>Celebration Date: {orderDetails.birthDate}</span>
                      )}
                    </p>
                    {orderDetails.specialInstructions && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">
                          Special Instructions:
                        </span>{" "}
                        {orderDetails.specialInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">
                      <FiCreditCard className="inline-block mr-2" />
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setStep(3)}
                      className="text-sm text-pink-600 hover:text-pink-700"
                    >
                      Change
                    </button>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">
                      {paymentMethod === "credit_card" && "Credit Card"}
                      {paymentMethod === "debit_card" && "Debit Card"}
                      {paymentMethod === "paypal" && "PayPal"}
                      {paymentMethod === "wallet" && "Wallet"}
                      {paymentMethod === "cash_on_delivery" &&
                        "Cash on Delivery"}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">
                    <FiShoppingBag className="inline-block mr-2" />
                    Order Items
                  </h3>

                  <div className="border rounded-md divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="p-3 flex items-center">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-800">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.product.flavor}, {item.product.weight}
                          </p>
                          {item.customizations?.messageOnCake && (
                            <p className="text-xs text-gray-500 mt-1">
                              Message: &quot;{item.customizations.messageOnCake}
                              &quot;
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹
                            {(
                              item.product.discountPrice || item.product.price
                            ).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                  >
                    <FiChevronLeft className="mr-2" />
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-md flex items-center ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-pink-500 hover:bg-pink-600"
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiLock className="mr-2" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>

                {(error || processError) && (
                  <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-md flex items-start">
                    <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-2" />
                    <span>{processError || error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            discount={discount || 0}
            couponCode={coupon?.code}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

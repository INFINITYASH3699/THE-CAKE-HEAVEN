"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiEdit,
  FiTag,
} from "react-icons/fi";
import {
  removeFromCart,
  updateCartItemQuantity,
  updateCartItemCustomization,
  clearCart,
} from "@/redux/slices/cartSlice";
import { applyCoupon, removeCoupon } from "@/redux/slices/couponSlice";
import { RootState, AppDispatch } from "@/redux/store";
import CouponsDrawer from "@/components/shop/copuons/CouponsDrawer";
import ProductCard from "@/components/product/ProductCard";

// Placeholder for recommended products
const recommendedProducts = [
  {
    _id: "1",
    name: "Chocolate Cake",
    price: 350,
    images: ["/images/cake1.jpg"],
  },
  {
    _id: "2",
    name: "Strawberry Cake",
    price: 400,
    images: ["/images/cake2.jpg"],
  },
];

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const {
    coupon,
    discount,
    loading: couponLoading,
    error: couponError,
  } = useSelector((state: RootState) => state.coupon);

  const [couponCode, setCouponCode] = useState("");
  const [customizationItem, setCustomizationItem] = useState<string | null>(
    null
  );
  const [messageOnCake, setMessageOnCake] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showCouponsDrawer, setShowCouponsDrawer] = useState(false);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over ₹1000
  const total = subtotal + tax + shipping - (discount || 0);

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity > 0 && quantity <= 10) {
      dispatch(updateCartItemQuantity({ itemId, quantity }));
    }
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      if (coupon) {
        dispatch(removeCoupon());
      }
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // Pass products to check product-specific coupons
      const products = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      dispatch(
        applyCoupon({
          code: couponCode,
          cartTotal: subtotal,
          products,
        })
      );
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode("");
  };

  const openCustomizationModal = (
    itemId: string,
    message: string = "",
    instructions: string = ""
  ) => {
    setCustomizationItem(itemId);
    setMessageOnCake(message);
    setSpecialInstructions(instructions);
  };

  const saveCustomization = () => {
    if (customizationItem) {
      dispatch(
        updateCartItemCustomization({
          itemId: customizationItem,
          customizations: {
            messageOnCake,
            specialInstructions,
          },
        })
      );
      setCustomizationItem(null);
    }
  };

  const handleApplyCouponFromDrawer = (code: string) => {
    setCouponCode(code);
    // Pass products to check product-specific coupons
    const products = items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    dispatch(
      applyCoupon({
        code,
        cartTotal: subtotal,
        products,
      })
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-24 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Add some delicious cakes to your cart and they&apos;ll appear here.
          </p>
          <Link
            href="/shop/category/cakes"
            className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              {/* Cart Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product */}
                      <div className="col-span-6 flex items-center">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md shadow-sm">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            href={`/shop/product/${item.product._id}`}
                            className="text-lg font-medium text-gray-800 hover:text-pink-500 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.product.flavor}, {item.product.weight}
                          </p>
                          {(item.customizations?.messageOnCake ||
                            item.customizations?.specialInstructions) && (
                            <div className="mt-1 text-xs text-gray-500">
                              {item.customizations.messageOnCake && (
                                <p>
                                  Message: &quot;
                                  {item.customizations.messageOnCake}&quot;
                                </p>
                              )}
                              <button
                                onClick={() =>
                                  openCustomizationModal(
                                    item.id,
                                    item.customizations?.messageOnCake || "",
                                    item.customizations?.specialInstructions ||
                                      ""
                                  )
                                }
                                className="text-pink-500 flex items-center mt-1"
                              >
                                <FiEdit className="w-3 h-3 mr-1" /> Edit
                                customization
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        {item.product.discountPrice ? (
                          <div>
                            <span className="font-medium">
                              ₹{item.product.discountPrice}
                            </span>
                            <div className="text-xs text-gray-500 line-through">
                              ₹{item.product.price}
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium">
                            ₹{item.product.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex border border-gray-300 rounded-md shadow-sm">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus
                              className={item.quantity <= 1 ? "opacity-50" : ""}
                            />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-12 text-center focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity >= 10}
                          >
                            <FiPlus
                              className={
                                item.quantity >= 10 ? "opacity-50" : ""
                              }
                            />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-right">
                        <div className="font-medium">
                          ₹
                          {(
                            (item.product.discountPrice || item.product.price) *
                            item.quantity
                          ).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-sm text-gray-500 hover:text-red-500 mt-1 flex items-center ml-auto"
                        >
                          <FiTrash2 className="w-3 h-3 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <button
                  onClick={handleClearCart}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 className="mr-2" /> Clear Cart
                </button>
                <Link
                  href="/shop"
                  className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <FiArrowLeft className="mr-2" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order Summary
                </h2>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
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

                {/* Coupon */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FiTag className="text-gray-500 mr-2" />
                      <span className="font-medium text-gray-700">
                        Apply Coupon
                      </span>
                    </div>
                    {!coupon && (
                      <button
                        onClick={() => setShowCouponsDrawer(true)}
                        className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        See available coupons
                      </button>
                    )}
                  </div>
                  {coupon ? (
                    <div className="bg-green-50 p-3 rounded-md shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-green-800">
                            {coupon.code}
                          </p>
                          <p className="text-sm text-green-600">
                            {discount &&
                              `₹${discount.toFixed(2)} discount applied`}
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 shadow-sm"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600 focus:outline-none disabled:opacity-70 transition-colors shadow-sm"
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-sm text-red-600 mt-1">{couponError}</p>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-semibold">Total</span>
                    <span className="text-xl font-bold text-gray-800">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Including taxes and shipping costs
                  </p>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/shop/checkout"
                  className="block w-full mt-6 py-3 px-4 bg-pink-500 text-white text-center font-medium rounded-md hover:bg-pink-600 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-center">
                    Proceed to Checkout
                    <FiArrowRight className="ml-2" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display recommended products */}
      {items.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Link
              href="/shop"
              className="text-pink-600 hover:text-pink-700 transition-colors"
            >
              See more products <FiArrowRight className="inline-block ml-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {customizationItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Customize Your Order
            </h3>

            <div className="mb-4">
              <label
                htmlFor="messageOnCake"
                className="block text-gray-700 font-medium mb-2"
              >
                Message on Cake
              </label>
              <input
                type="text"
                id="messageOnCake"
                placeholder="e.g., Happy Birthday, John!"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                value={messageOnCake}
                onChange={(e) => setMessageOnCake(e.target.value)}
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 50 characters. {50 - messageOnCake.length} characters left.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="specialInstructions"
                className="block text-gray-700 font-medium mb-2"
              >
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                rows={3}
                placeholder="Any special requests for your order..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setCustomizationItem(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomization}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <CouponsDrawer
        isOpen={showCouponsDrawer}
        onClose={() => setShowCouponsDrawer(false)}
        onApplyCoupon={handleApplyCouponFromDrawer}
        cartTotal={subtotal}
      />
    </div>
  );
};

export default CartPage;

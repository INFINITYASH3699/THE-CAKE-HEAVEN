// components/shop/coupons/CouponsDrawer.tsx
import { useState, useEffect } from "react";
import { FiX, FiTag, FiCopy, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchActiveCoupons } from "@/services/couponService";
import { format } from "date-fns";

interface CouponsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (couponCode: string) => void;
  cartTotal: number;
}

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  minimumPurchase: number;
  maximumDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  perUserLimit?: number;
}

const CouponsDrawer = ({
  isOpen,
  onClose,
  onApplyCoupon,
  cartTotal,
}: CouponsDrawerProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadCoupons();
    }
  }, [isOpen]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchActiveCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Error loading coupons:", err);
      setError("Failed to load available coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleApply = (code: string) => {
    onApplyCoupon(code);
    onClose();
  };

  const isCouponApplicable = (coupon: Coupon) => {
    return cartTotal >= coupon.minimumPurchase;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <FiTag className="h-5 w-5 text-pink-500 mr-2" />
                <h2 className="text-lg font-semibold">Available Coupons</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : error ? (
                <div className="text-center p-6">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={loadCoupons}
                    className="mt-2 text-pink-500 underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-gray-500">
                    No active coupons available at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {coupons.map((coupon) => {
                    const isApplicable = isCouponApplicable(coupon);
                    return (
                      <div
                        key={coupon._id}
                        className={`border rounded-lg p-4 ${
                          isApplicable
                            ? "border-pink-200 bg-pink-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-800 mb-1">
                              {coupon.code}
                            </div>
                            <p className="text-sm text-gray-600">
                              {coupon.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-pink-600">
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountAmount}% OFF`
                                : `₹${coupon.discountAmount} OFF`}
                            </div>
                            {coupon.minimumPurchase > 0 && (
                              <div className="text-xs text-gray-500">
                                Min order: ₹{coupon.minimumPurchase.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Valid till{" "}
                            {format(new Date(coupon.validUntil), "dd MMM yyyy")}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCopyCode(coupon.code)}
                              className="text-xs flex items-center text-gray-600 hover:text-pink-600"
                            >
                              {copiedCode === coupon.code ? (
                                <>
                                  <FiCheck className="h-3 w-3 mr-1" /> Copied
                                </>
                              ) : (
                                <>
                                  <FiCopy className="h-3 w-3 mr-1" /> Copy
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleApply(coupon.code)}
                              disabled={!isApplicable}
                              className={`text-xs px-2 py-1 rounded ${
                                isApplicable
                                  ? "bg-pink-500 text-white hover:bg-pink-600"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              {isApplicable ? "Apply" : "Not Applicable"}
                            </button>
                          </div>
                        </div>

                        {!isApplicable && (
                          <div className="mt-2 text-xs text-red-500">
                            Minimum purchase of ₹
                            {coupon.minimumPurchase.toFixed(2)} required
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CouponsDrawer;
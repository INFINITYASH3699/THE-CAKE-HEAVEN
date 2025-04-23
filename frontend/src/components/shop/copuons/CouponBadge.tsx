// components/shop/coupons/CouponBadge.tsx
import { useState } from "react";
import { FiTag } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface CouponBadgeProps {
  code: string;
  discount: string;
  onClick?: () => void;
}

const CouponBadge = ({ code, discount, onClick }: CouponBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex items-center bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded cursor-pointer"
        onClick={onClick}
      >
        <FiTag className="h-3 w-3 mr-1" />
        {code}
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg p-3 text-xs"
          >
            <p className="font-medium text-gray-800 mb-1">{code}</p>
            <p className="text-pink-600 font-semibold">{discount}</p>
            <p className="text-gray-600 mt-1">
              Click to copy and apply at checkout
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponBadge;

// utils/couponUtils.ts
/**
 * Formats a coupon discount for display
 */
export const formatCouponDiscount = (
  discountType: string,
  discountAmount: number
): string => {
  if (discountType === "percentage") {
    return `${discountAmount}% OFF`;
  } else {
    return `₹${discountAmount.toFixed(2)} OFF`;
  }
};

/**
 * Checks if a coupon is applicable based on cart total
 */
export const isCouponApplicable = (
  minimumPurchase: number,
  cartTotal: number
): boolean => {
  return cartTotal >= minimumPurchase;
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (
  discountType: string,
  discountAmount: number,
  cartTotal: number,
  maximumDiscount?: number | null
): number => {
  let discount = 0;

  if (discountType === "percentage") {
    discount = (cartTotal * discountAmount) / 100;

    // Apply maximum discount if set
    if (
      maximumDiscount !== undefined &&
      maximumDiscount !== null &&
      discount > maximumDiscount
    ) {
      discount = maximumDiscount;
    }
  } else {
    // Fixed amount discount
    discount = discountAmount;

    // Ensure discount doesn't exceed cart total
    if (discount > cartTotal) {
      discount = cartTotal;
    }
  }

  return parseFloat(discount.toFixed(2));
};

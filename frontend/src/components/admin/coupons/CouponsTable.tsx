// components/admin/coupons/CouponsTable.tsx
import Link from "next/link";
import { Coupon } from "@/app/admin/coupons/page";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { BiCheck, BiX } from "react-icons/bi";
import { format, isPast, isFuture } from "date-fns";

interface CouponsTableProps {
  coupons: Coupon[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  statusUpdateLoading: string | null;
}

const CouponsTable = ({
  coupons,
  onDelete,
  onToggleStatus,
  statusUpdateLoading,
}: CouponsTableProps) => {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">No coupons found</p>
      </div>
    );
  }

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return "inactive";

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (isFuture(validFrom)) return "upcoming";
    if (isPast(validUntil)) return "expired";
    return "active";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Coupon Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type & Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Validity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Usage
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => {
              const status = getCouponStatus(coupon);

              return (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {coupon.code}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {coupon.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountAmount}%`
                        : `$${coupon.discountAmount.toFixed(2)}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {coupon.minimumPurchase > 0 && (
                        <span>Min: ${coupon.minimumPurchase.toFixed(2)}</span>
                      )}
                      {coupon.maximumDiscount && (
                        <span className="ml-2">
                          Max: ${coupon.maximumDiscount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">
                      From: {format(new Date(coupon.validFrom), "MMM dd, yyyy")}
                    </div>
                    <div className="text-xs text-gray-500">
                      To: {format(new Date(coupon.validUntil), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        status
                      )}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coupon.usageCount} uses
                    {coupon.usageLimit && (
                      <span className="text-xs text-gray-400 ml-1">
                        / {coupon.usageLimit}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() =>
                          onToggleStatus(coupon._id, coupon.isActive)
                        }
                        disabled={statusUpdateLoading === coupon._id}
                        className={`p-1 rounded-full ${
                          coupon.isActive
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        title={
                          coupon.isActive
                            ? "Deactivate coupon"
                            : "Activate coupon"
                        }
                      >
                        {statusUpdateLoading === coupon._id ? (
                          <div className="h-5 w-5 border-2 border-t-transparent border-pink-600 rounded-full animate-spin"></div>
                        ) : coupon.isActive ? (
                          <BiX className="h-5 w-5" />
                        ) : (
                          <BiCheck className="h-5 w-5" />
                        )}
                      </button>
                      <Link
                        href={`/admin/coupons/${coupon._id}`}
                        className="p-1 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
                        title="View coupon details"
                      >
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/admin/coupons/${coupon._id}/edit`}
                        className="p-1 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rounded-full"
                        title="Edit coupon"
                      >
                        <FiEdit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => onDelete(coupon._id)}
                        disabled={statusUpdateLoading === coupon._id}
                        className="p-1 bg-red-100 text-red-600 hover:bg-red-200 rounded-full"
                        title="Delete coupon"
                      >
                        {statusUpdateLoading === coupon._id ? (
                          <div className="h-5 w-5 border-2 border-t-transparent border-pink-600 rounded-full animate-spin"></div>
                        ) : (
                          <FiTrash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponsTable;

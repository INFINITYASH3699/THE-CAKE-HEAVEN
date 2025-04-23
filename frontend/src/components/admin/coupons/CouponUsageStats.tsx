// components/admin/coupons/CouponUsageStats.tsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatDistance } from "date-fns";

// Define types for the component and data structures
interface CouponUsageStatsProps {
  coupon: {
    _id: string;
    code: string;
    isActive: boolean;
    validFrom: string | Date;
    validUntil: string | Date;
    usageCount: number;
    usageLimit: number | null;
    perUserLimit: number | null;
    usedBy?: UsageRecord[];
    createdAt: string | Date;
    [key: string]: any;
  };
}

interface UsageRecord {
  user: string | { _id: string; name: string; [key: string]: any };
  usedAt: string | Date;
  orderId: string | { _id: string; [key: string]: any };
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface UsageHistoryItem {
  user: string;
  date: Date;
  orderId: string;
}

const CouponUsageStats = ({ coupon }: CouponUsageStatsProps) => {
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  // Calculate remaining time or time since expiration
  const getTimeRemaining = () => {
    if (now < validFrom) {
      return `Starts ${formatDistance(validFrom, now)} from now`;
    } else if (now > validUntil) {
      return `Expired ${formatDistance(validUntil, now)} ago`;
    } else {
      return `Expires in ${formatDistance(validUntil, now)}`;
    }
  };

  // Usage data for pie chart
  const usageData: ChartDataItem[] = [
    { name: "Used", value: coupon.usageCount || 0, color: "#9333ea" },
  ];

  if (coupon.usageLimit) {
    usageData.push({
      name: "Remaining",
      value: Math.max(0, coupon.usageLimit - coupon.usageCount),
      color: "#e5e7eb",
    });
  }

  // Recent usage history
  const recentUsage: UsageHistoryItem[] = coupon.usedBy
    ? coupon.usedBy.slice(0, 5).map((usage: UsageRecord) => {
        const userName =
          typeof usage.user === "object" ? usage.user.name : usage.user;
        const orderIdStr =
          typeof usage.orderId === "object" ? usage.orderId._id : usage.orderId;

        return {
          user: userName,
          date: new Date(usage.usedAt),
          orderId: orderIdStr,
        };
      })
    : [];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Coupon Statistics</h2>
      </div>

      <div className="px-6 py-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Status
          </h3>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Active:</span>
              <span
                className={`text-sm font-medium ${coupon.isActive ? "text-green-600" : "text-red-600"}`}
              >
                {coupon.isActive ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Time Remaining:</span>
              <span className="text-sm font-medium text-gray-900">
                {getTimeRemaining()}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            Usage
          </h3>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Used:</span>
              <span className="text-sm font-medium text-gray-900">
                {coupon.usageCount || 0}
                {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
              </span>
            </div>
            {coupon.perUserLimit && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Per User Limit:</span>
                <span className="text-sm font-medium text-gray-900">
                  {coupon.perUserLimit}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Show usage chart if we have usage data or limits */}
        {(coupon.usageCount > 0 || coupon.usageLimit) && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Usage Chart
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Show recent usage if available */}
        {recentUsage.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Recent Usage
            </h3>
            <ul className="divide-y divide-gray-200">
              {recentUsage.map((usage, index) => (
                <li key={index} className="py-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {usage.user}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistance(usage.date, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Order: {usage.orderId}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponUsageStats;

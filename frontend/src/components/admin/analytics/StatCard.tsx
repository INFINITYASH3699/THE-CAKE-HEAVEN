// components/admin/analytics/StatCard.tsx
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiUsers, FiBox, FiPercent } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: 'revenue' | 'orders' | 'average' | 'users' | 'products' | 'conversion';
}

const StatCard = ({ title, value, change, isPositive = true, icon }: StatCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'revenue':
        return <FiDollarSign className="h-6 w-6 text-green-500" />;
      case 'orders':
        return <FiShoppingBag className="h-6 w-6 text-blue-500" />;
      case 'average':
        return <FiTrendingUp className="h-6 w-6 text-purple-500" />;
      case 'users':
        return <FiUsers className="h-6 w-6 text-pink-500" />;
      case 'products':
        return <FiBox className="h-6 w-6 text-orange-500" />;
      case 'conversion':
        return <FiPercent className="h-6 w-6 text-indigo-500" />;
      default:
        return <FiDollarSign className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
          {change && (
            <p className={`text-xs mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↑' : '↓'} {change} from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
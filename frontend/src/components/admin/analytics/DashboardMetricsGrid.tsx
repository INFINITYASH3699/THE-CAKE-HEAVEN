// components/admin/analytics/DashboardMetricsGrid.tsx
import Link from "next/link";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

// Export the interface to make it importable
export interface MetricProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  link?: string;
}

interface DashboardMetricsGridProps {
  metrics: MetricProps[];
}

const DashboardMetricsGrid = ({ metrics }: DashboardMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, index) => (
        <Link
          key={index}
          href={metric.link || "#"}
          className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{metric.title}</p>
              <h3 className="text-2xl font-semibold mt-1">{metric.value}</h3>
              {metric.change && (
                <div className="flex items-center mt-2">
                  {metric.changeType === "positive" ? (
                    <FiArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : metric.changeType === "negative" ? (
                    <FiArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  ) : null}
                  <span
                    className={`text-xs ${
                      metric.changeType === "positive"
                        ? "text-green-500"
                        : metric.changeType === "negative"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {metric.change} from last month
                  </span>
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">{metric.icon}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardMetricsGrid;
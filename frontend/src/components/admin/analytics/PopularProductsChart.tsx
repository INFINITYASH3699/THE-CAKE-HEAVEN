// components/admin/analytics/PopularProductsChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PopularProduct {
  _id: string;
  name: string;
  count: number;
}

interface PopularProductsChartProps {
  data: PopularProduct[];
}

const PopularProductsChart = ({ data }: PopularProductsChartProps) => {
  // Format data for chart
  const chartData = data.map((item) => ({
    name:
      item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name,
    value: item.count,
    fullName: item.name, // for tooltip
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            {payload[0].payload.fullName}
          </p>
          <p className="text-sm text-gray-600">{`Orders: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#EC4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularProductsChart;

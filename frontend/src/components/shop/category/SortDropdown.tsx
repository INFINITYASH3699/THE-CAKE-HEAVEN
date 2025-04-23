// components/shop/category/SortDropdown.tsx
import React from "react";
import { FiChevronDown } from "react-icons/fi";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 cursor-pointer text-gray-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="popular">Most Popular</option>
        <option value="rating">Highest Rated</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <FiChevronDown className="text-gray-400" />
      </div>
    </div>
  );
};

export default SortDropdown;
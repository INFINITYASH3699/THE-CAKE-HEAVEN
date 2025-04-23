// components/shop/category/FilterSidebar.tsx
"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FilterOptions } from "@/redux/slices/productSlice";


interface FilterSidebarProps {
  filterOptions: FilterOptions;
  currentFilters: Record<string, string>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filterOptions, currentFilters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Expanded state for filter sections
  const [expanded, setExpanded] = useState({
    price: true,
    flavor: true,
    shape: true,
    layer: true,
    occasion: true,
    cakeType: true,
    eggType: true,
  });

  // Price range state
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice ? parseInt(currentFilters.minPrice) : filterOptions?.priceRange?.min || 0,
    max: currentFilters.maxPrice ? parseInt(currentFilters.maxPrice) : filterOptions?.priceRange?.max || 5000,
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const applyFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Add or update filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCheckboxChange = (filter: string, value: string) => {
    const currentValue = currentFilters[filter] || "";
    const newValue = currentValue === value ? "" : value;
    
    applyFilters({
      [filter]: newValue,
    });
  };

  const handlePriceRangeApply = () => {
    applyFilters({
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
    });
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="bg-white border rounded-lg p-4 sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-sm text-pink-500 hover:text-pink-600"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium mb-2"
          onClick={() => toggleSection("price")}
        >
          <span>Price Range</span>
          {expanded.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expanded.price && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">₹{priceRange.min}</span>
              <span className="text-sm text-gray-600">₹{priceRange.max}</span>
            </div>
            <input
              type="range"
              min={filterOptions?.priceRange?.min || 0}
              max={filterOptions?.priceRange?.max || 5000}
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min={filterOptions?.priceRange?.min || 0}
              max={filterOptions?.priceRange?.max || 5000}
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePriceRangeApply}
                className="px-3 py-1 bg-pink-100 text-pink-600 rounded-md text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Flavor Filter */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium mb-2"
          onClick={() => toggleSection("flavor")}
        >
          <span>Flavor</span>
          {expanded.flavor ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expanded.flavor && (
          <div className="space-y-2 mt-2">
            {filterOptions?.flavors?.map((flavor) => (
              <label key={flavor} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-pink-500 rounded"
                  checked={currentFilters.flavor === flavor}
                  onChange={() => handleCheckboxChange("flavor", flavor)}
                />
                <span className="ml-2 text-sm text-gray-700">{flavor}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Shape Filter */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium mb-2"
          onClick={() => toggleSection("shape")}
        >
          <span>Shape</span>
          {expanded.shape ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expanded.shape && (
          <div className="space-y-2 mt-2">
            {filterOptions?.shapes?.map((shape) => (
              <label key={shape} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-pink-500 rounded"
                  checked={currentFilters.shape === shape}
                  onChange={() => handleCheckboxChange("shape", shape)}
                />
                <span className="ml-2 text-sm text-gray-700">{shape}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Layer Filter */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium mb-2"
          onClick={() => toggleSection("layer")}
        >
          <span>Layers</span>
          {expanded.layer ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expanded.layer && (
          <div className="space-y-2 mt-2">
            {filterOptions?.layers?.map((layer) => (
              <label key={layer} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-pink-500 rounded"
                  checked={currentFilters.layer === layer}
                  onChange={() => handleCheckboxChange("layer", layer)}
                />
                <span className="ml-2 text-sm text-gray-700">{layer}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Occasion Filter */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium mb-2"
          onClick={() => toggleSection("occasion")}
        >
          <span>Occasion</span>
          {expanded.occasion ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expanded.occasion && (
          <div className="space-y-2 mt-2">
            {filterOptions?.occasions?.map((occasion) => (
              <label key={occasion} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-pink-500 rounded"
                  checked={currentFilters.occasion === occasion}
                  onChange={() => handleCheckboxChange("occasion", occasion)}
                />
                <span className="ml-2 text-sm text-gray-700">{occasion}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Cake Type Filter */}
      <div className="mb-6 border-b pb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium mb-2"
          onClick={() => toggleSection("cakeType")}
        >
          <span>Cake Type</span>
          {expanded.cakeType ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expanded.cakeType && (
          <div className="space-y-2 mt-2">
            {filterOptions?.cakeTypes?.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-pink-500 rounded"
                  checked={currentFilters.cakeType === type}
                  onChange={() => handleCheckboxChange("cakeType", type)}
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Egg Type Filter */}
      <div className="mb-6">
        <button
          className="flex justify-between items-center w-full text-left font-medium mb-2"
          onClick={() => toggleSection("eggType")}
        >
          <span>Egg Options</span>
          {expanded.eggType ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expanded.eggType && (
          <div className="space-y-2 mt-2">
            {filterOptions?.eggTypes?.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-pink-500 rounded"
                  checked={currentFilters.eggOrEggless === type}
                  onChange={() => handleCheckboxChange("eggOrEggless", type)}
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
// components/shop/category/Breadcrumb.tsx
import React from "react";
import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";

interface BreadcrumbProps {
  category: string;
  subcategory?: string;
  productName?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ category, subcategory, productName }) => {
  return (
    <nav className="flex items-center text-sm mb-6 text-gray-600">
      <Link href="/" className="flex items-center hover:text-pink-500">
        <FiHome className="mr-1" />
        <span>Home</span>
      </Link>
      <FiChevronRight className="mx-2 text-gray-400" />
      
      <Link href="/shop" className="hover:text-pink-500">
        Shop
      </Link>
      
      <FiChevronRight className="mx-2 text-gray-400" />
      
      {subcategory ? (
        <>
          <Link href={`/shop/category/${encodeURIComponent(category)}`} className="hover:text-pink-500">
            {category}
          </Link>
          <FiChevronRight className="mx-2 text-gray-400" />
          <span className="font-medium">{subcategory}</span>
        </>
      ) : productName ? (
        <>
          <Link href={`/shop/category/${encodeURIComponent(category)}`} className="hover:text-pink-500">
            {category}
          </Link>
          <FiChevronRight className="mx-2 text-gray-400" />
          <span className="font-medium text-gray-800">{productName}</span>
        </>
      ) : (
        <span className="font-medium text-gray-800">{category}</span>
      )}
    </nav>
  );
};

export default Breadcrumb;
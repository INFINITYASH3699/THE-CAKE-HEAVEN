// components/home/ProductSection.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { Product } from "@/types/product";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink: string;
  useCarousel?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  viewAllLink,
  useCarousel = products.length > 4,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      const scrollTo =
        direction === "left"
          ? Math.max(scrollLeft - clientWidth, 0)
          : Math.min(scrollLeft + clientWidth, scrollWidth);

      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });

      // Update scroll position after animation
      setTimeout(() => {
        if (carouselRef.current) {
          setScrollPosition(carouselRef.current.scrollLeft);
        }
      }, 300);
    }
  };

  // Check if we can scroll in either direction
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = carouselRef.current
    ? scrollPosition <
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
    : false;

  // Update scroll position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        setScrollPosition(carouselRef.current.scrollLeft);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {title}
          </h2>

          <div className="flex items-center">
            {useCarousel && (
              <div className="hidden md:flex mr-4 space-x-2">
                <button
                  className={`p-2 rounded-full ${
                    canScrollLeft
                      ? "text-pink-500 hover:bg-pink-50"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 rounded-full ${
                    canScrollRight
                      ? "text-pink-500 hover:bg-pink-50"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            <Link
              href={viewAllLink}
              className="flex items-center text-pink-500 hover:text-pink-600 font-medium transition"
            >
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>
        </div>

        {useCarousel ? (
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth snap-x"
            onScroll={() =>
              setScrollPosition(carouselRef.current?.scrollLeft || 0)
            }
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-none w-[280px] md:w-[300px] snap-start"
              >
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product as any} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;

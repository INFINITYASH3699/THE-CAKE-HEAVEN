"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";
import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  avgRating: number;
  numReviews: number;
  flavor: string;
  eggOrEggless: string;
  weight: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // For now, using mock data route. In production, use the actual API endpoint
        // const response = await axios.get('/api/products/featured?limit=8');
        const response = await axios.get("/api/products?featured=true&limit=8");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
        setError("Failed to load featured products. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <FiLoader className="animate-spin text-pink-500 w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Our Featured Cakes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our special selection of handcrafted cakes, prepared with premium ingredients
            and designed to make your celebrations memorable.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/shop/category/all"
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-300"
          >
            View All Cakes
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

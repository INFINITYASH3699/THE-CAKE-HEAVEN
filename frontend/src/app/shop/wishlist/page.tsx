// app/shop/wishlist/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2, FiShoppingCart, FiArrowLeft, FiHeart } from "react-icons/fi";
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { RootState, AppDispatch } from "@/redux/store";
import toast from "react-hot-toast"; // Import toast
import { useRouter } from "next/navigation"; // Import useRouter

// Define a WishlistItem interface that covers the minimum properties we know about
interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  weight: string;
  images: string[];
  mainCategory?: string;
  isActive?: boolean;
  flavor?: string;
  [key: string]: unknown; // Allow for any other properties
}

// Define a minimal Product interface with the required properties
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  mainCategory: string;
  isActive: boolean;
  stock: number;
  weight: string;
  flavor: string;
  [key: string]: unknown; // Allow for any other properties
}

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.wishlist);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist!"); // Use toast
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    toast.success("Wishlist cleared!"); // Use toast
  };

  const handleMoveToCart = (product: WishlistItem) => {
    // First, extract the properties we need to explicitly set
    const { _id, name, price, images, stock, weight } = product;

    // Then create the cart product with required fields and defaults where needed
    const cartProduct: Product = {
      _id,
      name,
      price,
      images,
      stock,
      weight,
      mainCategory: (product.mainCategory as string) || "Cakes",
      isActive: (product.isActive as boolean) || true,
      flavor: (product.flavor as string) || "Default",
      // Add other required properties with defaults
      // DO NOT spread the product object to avoid duplicates
    };

    dispatch(
      addToCart({
        product: cartProduct,
        quantity: 1,
      })
    );
    dispatch(removeFromWishlist(product._id));
    toast.success("Moved to cart!"); // Use toast
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <FiHeart className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist</h1>
        <p className="text-gray-600 mb-6">Please login to view your wishlist</p>
        <Link
          href="/login"
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full font-medium transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <FiHeart className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Your Wishlist is Empty
        </h1>
        <p className="text-gray-600 mb-6">
          Find something you love and add it to your wishlist!
        </p>
        <Link
          href="/shop/category/cakes"
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full font-medium transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Wishlist
        </h1>
        <button
          onClick={handleClearWishlist}
          className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
        >
          <FiTrash2 className="mr-1" />
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-56">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <Link
                href={`/shop/product/${product._id}`}
                className="block text-lg font-medium text-gray-800 hover:text-pink-500 transition-colors"
              >
                {product.name}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{product.weight}</p>
              <div className="mt-2">
                {product.discountPrice ? (
                  <>
                    <span className="font-medium text-gray-800">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className="font-medium text-gray-800">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <div className="mt-3 flex justify-between items-center">
                {product.stock > 0 ? (
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </span>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMoveToCart(product as WishlistItem)}
                    disabled={product.stock <= 0}
                    className={`p-2 rounded-full text-white ${
                      product.stock > 0
                        ? "bg-pink-500 hover:bg-pink-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    title="Add to Cart"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Link
          href="/shop/category/cakes"
          className="text-pink-500 hover:text-pink-600 font-medium flex items-center"
        >
          <FiArrowLeft className="mr-1" />
          Continue Shopping
        </Link>
        <button
          onClick={handleClearWishlist}
          className="text-gray-600 hover:text-gray-800 text-sm flex items-center transition-colors"
        >
          <FiTrash2 className="mr-1" />
          Clear Wishlist
        </button>
      </div>
    </div>
  );
};

export default WishlistPage;

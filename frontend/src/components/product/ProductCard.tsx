"use client";

import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // slick-carousel CSS
import "slick-carousel/slick/slick-theme.css"; // slick-carousel theme

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  mainCategory: string;
  weight: string;
  flavor: string;
  isActive: boolean;
  [key: string]: unknown;
}

type ProductCardProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    avgRating?: number;
    numReviews?: number;
    isBestSeller?: boolean;
    isNew?: boolean;
    stock?: number;
    mainCategory?: string;
    weight?: string;
    flavor?: string;
    isActive?: boolean;
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  const {
    _id,
    name,
    price,
    discountPrice,
    images,
    avgRating = 0,
    numReviews = 0,
    isBestSeller,
    isNew,
    stock = 0,
  } = product;

  const [isAdding, setIsAdding] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { items: wishlistItems, loading: wishlistLoading } = useSelector(
    (state: RootState) => state.wishlist
  );

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const isInWishlist = wishlistItems.some((item) => item._id === _id);

  const handleAddToCart = () => {
    setIsAdding(true);

    const cartProduct: CartProduct = {
      _id,
      name,
      price,
      discountPrice,
      images,
      mainCategory: product.mainCategory || "Cakes",
      isActive: product.isActive !== undefined ? product.isActive : true,
      weight: product.weight || "Default",
      flavor: product.flavor || "Default",
      stock: stock || 0,
    };

    dispatch(
      addToCart({
        product: cartProduct,
        quantity: 1,
      })
    );

    toast.success(`${name} added to cart!`);

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist");
      router.push("/login");
      return;
    }

    setAddingToWishlist(true);

    try {
      if (isInWishlist) {
        try {
          await dispatch(removeFromWishlistAsync(_id)).unwrap();
          toast.success(`${name} removed from wishlist`);
        } catch (error) {
          console.error("API failed but removing from local state:", error);
          dispatch({ type: "wishlist/removeFromWishlist", payload: _id });
          toast.success(`${name} removed from local wishlist`);
        }
      } else {
        const productToAdd = {
          _id,
          name,
          price,
          discountPrice,
          images,
          stock: stock || 0,
          weight: product.weight || "Default",
          flavor: product.flavor || "Default",
        };

        try {
          await dispatch(addToWishlistAsync(productToAdd)).unwrap();
          toast.success(`${name} added to wishlist`);
        } catch (error) {
          console.error("API failed but adding to local state:", error);
          dispatch({ type: "wishlist/addToWishlist", payload: productToAdd });
          toast.success(`${name} added to local wishlist`);
        }
      }
    } catch (error) {
      toast.error(`Failed to update wishlist: ${error}`);
    } finally {
      setAddingToWishlist(false);
    }
  };

  // Slider settings with autoplay
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ring-1 ring-gray-200">
      {/* Product badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isBestSeller && (
          <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-0.5 rounded shadow">
            Best Seller
          </span>
        )}
        {isNew && (
          <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded shadow">
            New
          </span>
        )}
        {discountPrice && (
          <span className="bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded shadow">
            {Math.round(((price - discountPrice) / price) * 100)}% OFF
          </span>
        )}
        {stock <= 0 && (
          <span className="bg-gray-700 text-white text-xs font-medium px-2 py-0.5 rounded shadow">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist button - Always Visible */}
      <button
        onClick={handleWishlistToggle}
        disabled={addingToWishlist || wishlistLoading}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full shadow-lg transition-colors duration-300 transform hover:scale-110
          ${
            isInWishlist
              ? "bg-pink-100 hover:bg-pink-200"
              : "bg-white hover:bg-gray-100"
          }
          ${addingToWishlist || wishlistLoading ? "cursor-wait" : ""}`}
      >
        {addingToWishlist ? (
          <div className="h-5 w-5 border-t-2 border-pink-500 rounded-full animate-spin"></div>
        ) : (
          <FiHeart
            className={`w-5 h-5 ${
              isInWishlist ? "text-pink-500" : "text-gray-500"
            } fill-current`}
          />
        )}
      </button>

      {/* Product carousel */}
      {images.length > 1 ? (
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className="relative h-64 w-full overflow-hidden">
              <Image
                src={image}
                alt={`${name} image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
                style={{ transition: "transform 0.3s ease" }}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <Link
          href={`/shop/product/${_id}`}
          aria-label={`View details for ${name}`}
        >
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={images[0] || "/images/placeholder.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
              style={{ transition: "transform 0.3s ease" }}
            />
          </div>
        </Link>
      )}

      {/* Product info */}
      <div className="p-4">
        <Link
          href={`/shop/product/${_id}`}
          className="block"
          aria-label={`View details for ${name}`}
        >
          <h3 className="text-lg font-medium text-gray-800 hover:text-pink-500 transition line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mt-1">
          <div className="flex items-center text-yellow-400">
            <FiStar className="w-4 h-4 fill-current" aria-hidden="true" />
            <span className="ml-1 text-sm font-medium">
              {avgRating.toFixed(1)}
            </span>
          </div>
          <span
            className="text-xs text-gray-500 ml-1"
            aria-label={`${numReviews} reviews`}
          >
            ({numReviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center">
          {discountPrice ? (
            <>
              <span className="text-lg font-bold text-pink-600">
                ₹{discountPrice.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-pink-600">
              ₹{price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={stock <= 0 || isAdding}
          className={`mt-3 w-full py-2 px-4 rounded-md transition flex items-center justify-center transform hover:scale-105
            ${
              stock <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isAdding
                  ? "bg-green-500 text-white cursor-wait"
                  : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          aria-label="Add to cart"
        >
          {isAdding ? (
            <div className="flex items-center">
              <div className="mr-2 h-5 w-5 border-t-2 border-white rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : (
            <>
              <FiShoppingCart className="mr-2" aria-hidden="true" />
              {stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

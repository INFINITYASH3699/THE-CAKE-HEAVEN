// app/shop/product/[productId]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "@/components/shop/category/Breadcrumb";
import ReviewSection from "@/components/shop/product/ReviewSection";
import RelatedProducts from "@/components/shop/product/RelatedProducts";
import {
  FiHeart,
  FiShare2,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiImage,
  FiExternalLink, // For social sharing
} from "react-icons/fi";
import {
  fetchProductById,
  fetchRelatedProducts,
  Review,
} from "@/redux/slices/productSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import { RootState, AppDispatch } from "@/redux/store";
import toast from "react-hot-toast";

interface Customizations {
  messageOnCake: string;
  specialInstructions: string;
}

interface ProductCustomization {
  allowMessageOnCake?: boolean;
  allowCustomDesign?: boolean;
  extraChargeForCustomization?: string;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams();
  const router = useRouter(); //Use useRouter
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [messageOnCake, setMessageOnCake] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] =
    useState(false); // Confirmation Message State
  const [addedToCart, setAddedToCart] = useState(false); // Added To Cart Button State

  const { product, loading, relatedProducts } = useSelector(
    (state: RootState) => state.products
  );

  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const isInWishlist = productId
    ? wishlistItems.some((item) => item._id === productId)
    : false;
  const hasImages =
    product?.images &&
    Array.isArray(product.images) &&
    product.images.length > 0;

  const fetchProductData = useCallback(async () => {
    if (productId) {
      dispatch(
        fetchProductById(
          typeof productId === "string" ? productId : String(productId)
        )
      );
      dispatch(
        fetchRelatedProducts(
          typeof productId === "string" ? productId : String(productId)
        )
      );
      setSelectedImage(0);
      setAddedToCart(false); // Reset the "Go to Cart" button state
    }
  }, [dispatch, productId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  useEffect(() => {
    if (
      product &&
      (!hasImages || selectedImage >= (product.images?.length || 0))
    ) {
      setSelectedImage(0);
    }
  }, [product, selectedImage, hasImages]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true); // Start loading and also disables
    setShowAddToCartConfirmation(false); // Hide any existing confirmation message

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading delay

      dispatch(
        addToCart({
          product,
          quantity,
          customizations: {
            messageOnCake,
            specialInstructions,
          } as Customizations,
        })
      );

      setAddedToCart(true); // Change button to 'Go to Cart'
      setShowAddToCartConfirmation(true); //Show Added to cart confirmation

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false); // Stop loading and enable button back
      setTimeout(() => setShowAddToCartConfirmation(false), 3000);
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product._id));
        toast.success(`${product.name} removed from wishlist`);
      } else {
        dispatch(addToWishlist(product));
        toast.success(`${product.name} added to wishlist`);
      }
    }
  };

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: product.description || `Check out ${product.name} on Cake Heaven!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        copyToClipboard(shareData.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error: any) {
      console.error("Sharing failed:", error);
      toast.error(
        `Sharing failed: ${error.message || "Could not share product"}`
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link to clipboard.");
      });
  };

  const openShareDialog = () => {
    if (!product) return;

    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(
      `${product.name} - ${product.description || "Check out this product!"}`
    );

    // Define social media share URLs
    const socialMedia = [
      {
        name: "Facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      },
      {
        name: "Twitter",
        url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      },
      {
        name: "Pinterest",
        url: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}&media=${encodeURIComponent(product.images[0] || "")}`,
      },
      // Add more social media options as needed
    ];

    // Open share dialog
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={() => setShowShareDialog(false)}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="p-6 text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Share this product
              </h3>
              <ul className="flex flex-col gap-4">
                {socialMedia.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center justify-center gap-4"
                    >
                      {item.name}
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const incrementQuantity = () => {
    if (product && quantity < 10 && quantity < (product.stock || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - (product.discountPrice || 0)) / product.price) * 100
      )
    : 0;

  const avgRating =
    typeof product.avgRating === "number" ? product.avgRating : 0;

  const numReviews =
    typeof product.numReviews === "number" ? product.numReviews : 0;

  const reviews = Array.isArray(product.reviews)
    ? (product.reviews as Review[])
    : [];

  const customization = product.customization as
    | ProductCustomization
    | undefined;

  return (
    <div className="container mx-auto px-4 md:px-24 py-8">
      <Breadcrumb
        category={product.mainCategory || ""}
        subcategory={(product.subCategory as string) || ""}
        productName={product.name}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="relative h-[500px] mb-4 rounded-lg overflow-hidden border border-gray-200">
            {hasImages ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                <FiImage className="h-16 w-16 mb-2" />
                <p>No image available</p>
              </div>
            )}
            {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-pink-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          <div className="flex overflow-x-auto space-x-2 pb-2">
            {hasImages ? (
              product.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === index ? "border-pink-500" : "border-transparent"}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                No images
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(avgRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">
                {avgRating.toFixed(1)} ({numReviews} reviews)
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-bold text-gray-800">
                    ₹{product.discountPrice}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                  <span className="ml-2 text-green-600 text-sm font-medium">
                    Save {discountPercentage}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-800">
                  ₹{product.price}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Product Specifications */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {typeof product.weight === "string" && product.weight && (
              <div>
                <span className="text-gray-600 text-sm">Weight:</span>
                <p className="font-medium">{product.weight}</p>
              </div>
            )}
            {typeof product.flavor === "string" && product.flavor && (
              <div>
                <span className="text-gray-600 text-sm">Flavor:</span>
                <p className="font-medium">{product.flavor}</p>
              </div>
            )}
            {typeof product.shape === "string" && product.shape && (
              <div>
                <span className="text-gray-600 text-sm">Shape:</span>
                <p className="font-medium">{product.shape}</p>
              </div>
            )}
            {typeof product.eggOrEggless === "string" &&
              product.eggOrEggless && (
                <div>
                  <span className="text-gray-600 text-sm">Type:</span>
                  <p className="font-medium">{product.eggOrEggless}</p>
                </div>
              )}
            {typeof product.layer === "string" && product.layer && (
              <div>
                <span className="text-gray-600 text-sm">Layers:</span>
                <p className="font-medium">{product.layer}</p>
              </div>
            )}
            {typeof product.cakeType === "string" &&
              product.cakeType &&
              product.cakeType !== "Regular" && (
                <div>
                  <span className="text-gray-600 text-sm">Cake Type:</span>
                  <p className="font-medium">{product.cakeType}</p>
                </div>
              )}
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Availability
            </h3>
            {(product.stock || 0) > 0 ? (
              <p className="text-green-600">
                In Stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-red-600">Out of Stock</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                disabled={
                  quantity <= 1 || (product.stock || 0) <= 0 || isAddingToCart
                }
              >
                <FiMinus />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                disabled={
                  product &&
                  (quantity >= 10 ||
                    quantity >= (product.stock || 0) ||
                    (product.stock || 0) <= 0 ||
                    isAddingToCart)
                }
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Customization options */}
          {customization && customization.allowMessageOnCake && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Cake Message
              </h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                rows={2}
                placeholder="Enter a message for the cake (optional)"
                value={messageOnCake}
                onChange={(e) => setMessageOnCake(e.target.value)}
                maxLength={50}
                disabled={(product.stock || 0) <= 0 || isAddingToCart}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Maximum 50 characters
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Special Instructions
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
              rows={3}
              placeholder="Any special instructions for your order (optional)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              disabled={(product.stock || 0) <= 0 || isAddingToCart}
            ></textarea>
          </div>
          {showAddToCartConfirmation && (
            <div className="text-green-600 mb-4">
              {product.name} added to cart!
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            {addedToCart ? (
              <Link
                href="/shop/cart"
                className="flex-1 py-3 px-6 rounded-full font-medium flex items-center justify-center transition bg-green-500 hover:bg-green-600 text-white"
              >
                <FiShoppingCart className="mr-2" />
                Go to Cart
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={(product.stock || 0) <= 0 || isAddingToCart}
                className={`flex-1 py-3 px-6 rounded-full font-medium flex items-center justify-center transition
                                ${
                                  (product.stock || 0) > 0
                                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }
                                ${isAddingToCart ? "opacity-75 cursor-wait" : ""}`}
              >
                {isAddingToCart ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-5 w-5 border-t-2 border-white rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  <>
                    <FiShoppingCart className="mr-2" />
                    {(product.stock || 0) > 0 ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition
                                ${
                                  isInWishlist
                                    ? "bg-pink-100 text-pink-500 border border-pink-500"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
              aria-label={
                isInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <FiHeart className={isInWishlist ? "fill-current" : ""} />
            </button>

            {/* New Share Button with Dropdown */}
            <button
              onClick={() => setShowShareDialog(true)}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
              aria-label="Share product"
            >
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>
      {showShareDialog && openShareDialog()}

      {/* Reviews Section */}
      <ReviewSection productId={product._id} reviews={reviews} />

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts.map((relatedProduct) => ({
            _id: relatedProduct._id,
            name: relatedProduct.name,
            price: relatedProduct.price,
            discountPrice: relatedProduct.discountPrice,
            images: relatedProduct.images,
            avgRating:
              typeof relatedProduct.avgRating === "number"
                ? relatedProduct.avgRating
                : 0,
            numReviews:
              typeof relatedProduct.numReviews === "number"
                ? relatedProduct.numReviews
                : 0,
            stock: relatedProduct.stock,
          }))}
        />
      )}
    </div>
  );
};

export default ProductPage;

// profile/favorites/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiStar, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { addToCart } from '@/redux/slices/cartSlice';
import { fetchWishlist, removeFromWishlistAsync } from '@/redux/slices/wishlistSlice';

const FavoritesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  
  // Get authentication and wishlist state from Redux
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items: favorites, loading: wishlistLoading, error: wishlistError } = useSelector(
    (state: RootState) => state.wishlist
  );

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        await dispatch(fetchWishlist());
      } catch (err: any) {
        console.error('Error loading favorites:', err);
        setError('Failed to load your saved items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Update error state if wishlist has an error
    if (wishlistError) {
      setError(wishlistError);
    }
  }, [wishlistError]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await dispatch(removeFromWishlistAsync(productId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove item from favorites. Please try again.');
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      // Ensure the product has required fields
      const cartProduct = {
        ...product,
        // Add any missing required fields with default values
        mainCategory: product.mainCategory || "Cakes",
        isActive: product.isActive !== undefined ? product.isActive : true,
        weight: product.weight || "Default",
        flavor: product.flavor || "Default"
      };
      
      dispatch(addToCart({ 
        product: cartProduct, 
        quantity: 1 
      }));
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart. Please try again.');
    }
  };

  // Now using wishlistLoading instead of a separate loading state
  if (loading || wishlistLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Check for authentication
  if (!isAuthenticated) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">My Favorites</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-4">
            <FiHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please Log In</h3>
          <p className="text-gray-500 mb-4">Log in to see your saved favorites</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (error && (!favorites || favorites.length === 0)) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <FiAlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Favorites</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchWishlist())}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">My Favorites</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-4">
            <FiHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">Items you save will appear here</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Favorites</h2>
        <p className="text-gray-500 text-sm">{favorites.length} items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition relative"
          >
            <button
              onClick={() => handleRemoveFavorite(product._id)}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white shadow-sm hover:bg-red-50"
              title="Remove from favorites"
            >
              <FiTrash2 className="w-4 h-4 text-red-500" />
            </button>

            <Link href={`/shop/product/${product._id}`}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/shop/product/${product._id}`}>
                <h3 className="text-lg font-medium text-gray-800 hover:text-pink-500 transition line-clamp-1">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center mt-1">
                <div className="flex items-center text-yellow-400">
                  <FiStar className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {typeof product.avgRating === 'number' ? product.avgRating.toFixed(1) : '0'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({typeof product.numReviews === 'number' ? product.numReviews : 0} reviews)
                </span>
              </div>

              <div className="mt-2 flex items-center">
                {product.discountPrice ? (
                  <>
                    <span className="text-lg font-bold text-pink-600">
                      ₹{Number(product.discountPrice).toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-pink-600">₹{Number(product.price).toFixed(2)}</span>
                )}
              </div>

              <div className="mt-3 flex items-center space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center text-sm font-medium ${
                    product.stock > 0
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiShoppingCart className="mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
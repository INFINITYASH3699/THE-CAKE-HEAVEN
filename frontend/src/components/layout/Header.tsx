// components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { logout } from "@/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import SearchBar from "../common/SearchBar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false); // New state for header shrink

  // Get auth state
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Get cart state
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  // Get wishlist state
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const dispatch = useDispatch<AppDispatch>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate cart item count (considering quantities)
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Get wishlist item count
  const wishlistItemCount = wishlistItems.length;

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when navigating
  useEffect(() => {
    // Close mobile menu when URL changes
    return () => {
      setIsMenuOpen(false);
    };
  }, []);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50); // Adjust scroll threshold as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 bg-white shadow-md z-50 transition-all duration-300 ${isShrunk ? "py-0.5" : "py-1"}`}
    >
      {" "}
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-16 h-16 overflow-hidden rounded-full border border-gray-300 shadow-lg">
              <Image
                src="/images/logo.jpg"
                alt="Cake Heaven Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-1/2 mx-8">
            <SearchBar />
          </div>

          {/* Cart, Wishlist, Account - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/shop/cart"
              className="text-gray-700 hover:text-pink-500 relative"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href="/shop/wishlist"
              className="text-gray-700 hover:text-pink-500 relative"
            >
              <FiHeart className="w-5 h-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-1 text-gray-700 hover:text-pink-500"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    {typeof user?.name === "string" && user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <FiUser className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {typeof user?.name === "string" ? user.name : "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {typeof user?.email === "string" ? user.email : ""}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <FiUser className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    {typeof user?.role === "string" &&
                      user.role === "admin" && (
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <FiSettings className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </div>
                        </Link>
                      )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FiLogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {/* Search Bar - Mobile */}
            <div className="mb-4">
              <SearchBar
                placeholder="Search..."
                onMobileClose={closeMobileMenu}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-6">
                <Link
                  href="/shop/cart"
                  className="text-gray-700 hover:text-pink-500 relative"
                  onClick={closeMobileMenu}
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/shop/wishlist"
                  className="text-gray-700 hover:text-pink-500 relative"
                  onClick={closeMobileMenu}
                >
                  <FiHeart className="w-5 h-5" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col space-y-2 mt-4 border-t pt-4">
                <div className="flex items-center">
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-pink-500 flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <FiUser className="w-5 h-5 mr-2" />
                    <span>Profile</span>
                  </Link>
                </div>
                {typeof user?.role === "string" && user.role === "admin" && (
                  <div className="flex items-center">
                    <Link
                      href="/admin/dashboard"
                      className="text-gray-700 hover:text-pink-500 flex items-center"
                      onClick={closeMobileMenu}
                    >
                      <FiSettings className="w-5 h-5 mr-2" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-pink-500"
                >
                  <FiLogOut className="w-5 h-5 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 border-t pt-4">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

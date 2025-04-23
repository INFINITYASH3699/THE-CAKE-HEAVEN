// components/common/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onMobileClose?: () => void; // For closing mobile menu after search
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for cakes, pastries, cupcakes...",
  className = "",
  onMobileClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch search results whenever the debounced query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
        setResults([]);
        setShowDropdown(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchProducts({
          keyword: debouncedSearchQuery,
          limit: 5 // Limit to 5 results for the dropdown
        });
        
        if (response && response.products) {
          setResults(response.products as unknown as Product[]);
          setShowDropdown(true);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error searching products:", err);
        setError("Failed to search products");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Close mobile menu if function is provided
      if (onMobileClose) {
        onMobileClose();
      }
      
      // Navigate to search results page
      router.push(`/shop/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setLoading(true);
    } else {
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const selectProduct = (productId: string) => {
    if (onMobileClose) {
      onMobileClose();
    }
    setShowDropdown(false);
    router.push(`/shop/product/${productId}`);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-20 pr-2 flex items-center text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-500 hover:text-pink-600"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto border border-gray-200"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <FiLoader className="h-5 w-5 mx-auto animate-spin text-pink-500" />
              <p className="mt-2">Searching...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No products found</p>
            </div>
          ) : (
            <div>
              <div className="p-2 border-b border-gray-200">
                <h3 className="text-xs font-medium text-gray-500">PRODUCTS</h3>
              </div>

              <ul className="py-1">
                {results.map((product) => (
                  <li key={product._id}>
                    <button
                      className="w-full px-4 py-2 hover:bg-gray-100 flex items-center text-left"
                      onClick={() => selectProduct(product._id)}
                    >
                      <div className="w-12 h-12 relative mr-3 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                        <Image
                          src={product.images[0] || '/images/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {product.discountPrice ? (
                            <>
                              <span className="text-pink-600">₹{product.discountPrice}</span>{" "}
                              <span className="line-through">₹{product.price}</span>
                            </>
                          ) : (
                            <span className="text-gray-700">₹{product.price}</span>
                          )}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="p-2 border-t border-gray-200">
                <Link
                  href={`/shop/search?q=${encodeURIComponent(searchQuery)}`}
                  className="block w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium"
                  onClick={() => setShowDropdown(false)}
                >
                  See all results
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
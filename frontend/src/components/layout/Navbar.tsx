"use client"

import React, { useState } from "react";
import Link from "next/link";

interface DropdownState {
  cakes: boolean;
  cupcakes: boolean;
  pastry: boolean;
  desserts: boolean;
  trending: boolean;
  unique: boolean;
}

const Navbar: React.FC = () => {
  const [isNavbarCollapsed, setNavbarCollapsed] = useState<boolean>(true);
  const [isDropdownOpen, setDropdownOpen] = useState<DropdownState>({
    cakes: false,
    cupcakes: false,
    pastry: false,
    desserts: false,
    trending: false,
    unique: false,
  });

  const toggleNavbar = (): void => {
    setNavbarCollapsed(!isNavbarCollapsed);
  };

  const toggleDropdown = (dropdown: keyof DropdownState): void => {
    setDropdownOpen((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  return (
    <nav className="border-t border-b bg-pink-300">
      <div className="container mx-auto px-4">
        <button 
          className="lg:hidden flex items-center px-3 py-2 border rounded text-gray-500 border-gray-500 hover:text-gray-700 hover:border-gray-700" 
          type="button" 
          onClick={toggleNavbar}
        >
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
          </svg>
        </button>
        <div
          className={`${
            isNavbarCollapsed ? "hidden" : "block"
          } lg:flex justify-center lg:items-center w-full`}
        >
          <ul className="flex flex-col lg:flex-row">
            {/* Cakes Dropdown */}
            <li
              className="relative mx-3 group"
              onMouseEnter={() => toggleDropdown("cakes")}
              onMouseLeave={() => toggleDropdown("cakes")}
            >
              <Link
                className="block py-2 text-gray-800 hover:text-gray-600 flex items-center"
                href="/shop/category/cakes"
              >
                Cakes
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </Link>
              {isDropdownOpen.cakes && (
                <div className="absolute -left-40 mt-0 w-screen max-w-5xl bg-white border rounded-md shadow-lg z-1000">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 p-4">
                    <div className="space-y-2">
                      <h6 className="font-bold text-gray-700">Layers</h6>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?layer=One">One</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?layer=Two">Two</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?layer=Three">Three</Link>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-bold text-gray-700">By Shapes</h6>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?shape=Square">Square</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?shape=Circle">Circle</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?shape=Heart">Heart</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?shape=Tall">Tall</Link>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-bold text-gray-700">By Flavour</h6>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?flavor=Chocolate">Chocolate</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?flavor=Blueberry">Blueberry</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?flavor=Pineapple">Pineapple</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?flavor=Fresh%20Fruit">Fresh Fruit</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?flavor=Red%20Velvet">Red Velvet</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?flavor=Vanilla">Vanilla</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?flavor=Butterscotch">Butterscotch</Link>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-bold text-gray-700">By Occasion</h6>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Birthday">Birthday</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Anniversary">Anniversary</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Wedding">Wedding</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Baby%20Shower">Baby Shower</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Engagement">Engagement</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Mother%27s%20Day">Mother&apos;s Day</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Father%27s%20Day">Father&apos;s Day</Link>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-bold text-gray-700">By Festivals</h6>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?festival=Valentine's%20Day">Valentine&apos;s Day</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?subCategory=Classic">Classic Cakes</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?festival=Friendship's%20Day">Friendship&apos;s Day</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?festival=Christmas">Christmas</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Engagement">Engagement</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?festival=Teacher's%20Day">Teacher&apos;s Day</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?occasion=Farewell">Farewell Cakes</Link>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-bold text-gray-700">Trending Cakes</h6>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Pull%20Me%20Up">Pull Me Up Cake</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Pinata">Pinata Cake</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Half">Half Cake</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Bomb">Bomb Cake</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Bento">Bento Cake</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Surprise%20Box">Surprise Cake Box</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Photo%20Pulling">Photo Pulling Cake</Link>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-bold text-gray-700">Unique Cakes</h6>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Mousse">Mousse Cake</Link>
                      <Link className="block text-gray-600 hover:text-gray-800" href="/shop/category/cakes?cakeType=Bomb">Bomb Cake</Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* Cup-Cakes */}
            <li className="mx-3">
              <Link className="block py-2 text-gray-800 hover:text-gray-600" href="/shop/category/cupcakes">
                Cup-Cakes
              </Link>
            </li>

            {/* Pastry */}
            <li className="mx-3">
              <Link className="block py-2 text-gray-800 hover:text-gray-600" href="/shop/category/pastry">
                Pastry
              </Link>
            </li>

            {/* Desserts */}
            <li className="mx-3">
              <Link className="block py-2 text-gray-800 hover:text-gray-600" href="/shop/category/desserts">
                Desserts
              </Link>
            </li>

            {/* Trending Cakes */}
            <li className="mx-3">
              <Link className="block py-2 text-gray-800 hover:text-gray-600" href="/shop/category/cakes?trending=true">
                Trending Cakes
              </Link>
            </li>

            {/* Unique Cakes */}
            <li className="mx-3">
              <Link className="block py-2 text-gray-800 hover:text-gray-600" href="/shop/category/cakes?unique=true">
                Unique Cakes
              </Link>
            </li>

            {/* Featured Cakes */}
            <li className="mx-3">
              <Link className="block py-2 text-gray-800 hover:text-gray-600" href="/shop/category/cakes?featured=true">
                Featured Cakes
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
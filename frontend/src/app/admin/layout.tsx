"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { getUserProfile } from "@/redux/slices/userSlice";
import Link from "next/link";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiDatabase,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import { logout } from "@/redux/slices/authSlice";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        try {
          const userData = await dispatch(getUserProfile()).unwrap();
          if (userData.role !== "admin") {
            router.push("/login");
          }
        } catch {
          // Removed the unused '_' parameter
          router.push("/login");
        }
      } else if (isAuthenticated && user?.role !== "admin") {
        router.push("/");
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated, isLoading, router, user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null; // This will show nothing while redirecting
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FiHome },
    { name: "Products", href: "/admin/products", icon: FiShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: FiTag },
    { name: "Customers", href: "/admin/users", icon: FiUsers },
    { name: "Coupons", href: "/admin/coupons", icon: FiTag },
    { name: "Analytics", href: "/admin/analytics", icon: FiDatabase },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-40">
            <div className="fixed inset-0">
              <div
                className="absolute inset-0 bg-gray-600 opacity-75"
                onClick={() => setSidebarOpen(false)}
              ></div>
            </div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FiX className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link
                    href="/admin/dashboard"
                    className="text-xl font-bold text-pink-600"
                  >
                    Cake Heaven Admin
                  </Link>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <item.icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 group block w-full items-center"
                >
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                      Logout
                    </p>
                  </div>
                  <FiLogOut className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 w-14"></div>
          </div>
        )}
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link
                  href="/admin/dashboard"
                  className="text-xl font-bold text-pink-600"
                >
                  Cake Heaven Admin
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium text-sm">
                      {user.name[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {user.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500">Admin</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full flex items-center">
                  <div className="text-lg text-gray-800 hidden sm:block">
                    Welcome, {user.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Link
                href="/"
                className="px-3 py-1 text-sm text-gray-700 hover:text-pink-600"
              >
                Visit Site
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

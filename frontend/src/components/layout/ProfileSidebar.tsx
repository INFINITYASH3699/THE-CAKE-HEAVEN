'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiCreditCard, FiLogOut } from 'react-icons/fi';

const ProfileSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    {
      href: '/profile',
      label: 'My Profile',
      icon: <FiUser className="w-5 h-5" />,
      exact: true,
    },
    {
      href: '/profile/orders',
      label: 'My Orders',
      icon: <FiShoppingBag className="w-5 h-5" />,
    },
    {
      href: '/profile/wallet',
      label: 'My Wallet',
      icon: <FiCreditCard className="w-5 h-5" />,
    },
    {
      href: '/profile/addresses',
      label: 'Address Book',
      icon: <FiMapPin className="w-5 h-5" />,
    },
    {
      href: '/profile/favorites',
      label: 'Saved Items',
      icon: <FiHeart className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 sticky top-24 h-fit">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">My Account</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-md transition ${
              isActive(item.href, item.exact)
                ? 'bg-pink-50 text-pink-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar;